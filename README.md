<p align="center">
  <img src="icon.svg" alt="Frappe Helpdesk Logo" width="21%">
</p>

# Frappe Helpdesk on StartOS

> Everything not listed in this document should behave the same as upstream
> Frappe Helpdesk. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

Frappe Helpdesk is a customer-support ticketing system: tickets arrive by email or through a
customer portal, are routed by assignment rules, and are tracked against service level
agreements, with a knowledge base and saved replies alongside. Upstream is
<https://github.com/frappe/helpdesk>.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The application image is **built by this package from its own `Dockerfile`**, not pulled from a
registry. It follows upstream's own layered recipe — `bench init` against `frappe/build`, the
resulting bench copied onto `frappe/base` — with `apps.json` pinning the Helpdesk app and
`telephony`, which Helpdesk requires. The image upstream publishes cannot be used: its build
passes the app list as a build argument to a Containerfile that reads it from a secret mount, so
what it publishes is a bare Frappe bench with neither app installed, for amd64 only. The build
also bakes in the NLTK corpora that knowledge-base keyword extraction would otherwise download
from the internet at runtime.

MariaDB and Redis come from their official images, unmodified.

Built for x86_64 and aarch64. The package supplies an explicit command to every daemon rather
than using an image entrypoint.

| Subcontainer | Image | Purpose |
| --- | --- | --- |
| `seed-sites` | helpdesk | Populates the empty `sites` volume and links the compiled assets into it. Runs as root before anything else, on every start. |
| `mariadb` | mariadb | The database. |
| `redis-cache`, `redis-queue` | redis | Frappe's cache and its job queue / socket.io backplane. |
| `configurator` | helpdesk | Writes the bench's database and redis endpoints. Runs on every start. |
| `backend` | helpdesk | The gunicorn application server. |
| `websocket` | helpdesk | The socket.io server behind live ticket updates. |
| `scheduler` | helpdesk | Frappe's cron — SLA timers, auto-close, search indexing. |
| `queue-short`, `queue-long` | helpdesk | RQ workers for background jobs, including email send and receive. |
| `frontend` | helpdesk | nginx: serves assets, proxies the rest to `backend` and `websocket`. |

Init, backup and action work runs in its own short-lived subcontainers, named for what they do
(`site-init`, `site-migrate`, `bench-set-password`, and the database and cache instances each of
those needs).

All subcontainers share one network namespace and reach each other over `127.0.0.1`, so no two
may bind the same port.

## Volume and Data Layout

Three volumes. StartOS stops the service for the duration of a backup, so the database's data
directory is quiescent and is copied as files rather than dumped.

| Volume | Mount point | Contents |
| --- | --- | --- |
| `sites` | `/home/frappe/frappe-bench/sites` | The site directory: `site_config.json`, uploaded files and attachments, the site's encryption key. |
| `db` | `/var/lib/mysql` | MariaDB's data directory. |
| `main` | not mounted into any container | StartOS-side state — `store.json`. |

Every ticket, article, contact and setting is in the database. The `sites` volume holds the
files attached to them and the key that decrypts stored passwords, so neither is useful without
the other.

## File Models

One, and it is not upstream configuration a user would edit.

| Model | File | Ownership |
| --- | --- | --- |
| `storeJson` | `store.json` on the `main` volume | Written only by this package. Holds the generated MariaDB root password, the Administrator password the `set-admin-password` action last issued, the address chosen by `set-primary-url`, and the SMTP selection from `manage-smtp`. Never read by Helpdesk. |

The bench's global configuration — the database host and port, the three redis URLs, the
socket.io port and `host_name` — is **not** a file model. The `configurator` oneshot re-asserts
it with `bench set-config` on every start, so a restored backup can never carry stale endpoints
forward. A hand edit to `common_site_config.json` for any of those keys is overwritten on the
next start; other keys in that file are left alone.

The `StartOS` Email Account is re-asserted the same way, by the `smtp` oneshot, from the
`manage-smtp` selection. It claims `default_outgoing` only when no other account holds it, so a
mailbox configured inside Helpdesk is never displaced. Turning the selection off disables that
account rather than deleting it, because Email Queue rows link to it.

Helpdesk's own settings, including email accounts, live in the database and belong entirely to
the user.

## Dependencies

None.

## Network Access and Interfaces

One interface. The agent portal, the customer portal and the Frappe desk are all served by the
same nginx instance on the same port, so a second interface would only be a second link to the
same origin.

| Interface | Type | Port | Path | Serves |
| --- | --- | --- | --- | --- |
| `ui` | ui | 8080 | `/helpdesk` | The Helpdesk single-page app — the agent portal for staff, the customer portal for everyone else, chosen from the signed-in session. |

The Frappe desk at `/app` and the sign-in page at `/login` are reachable on the same address.

Gunicorn (8000), MariaDB (3306) and both Redis instances are bound to loopback; socket.io
(9000) binds all interfaces, because upstream's realtime server takes no bind address. All of
them sit inside the package's own network namespace, so only its subcontainers can reach them
and no interface exposes them.

Nothing in the package requires outbound internet access. Sending and receiving ticket email
does, once a user configures a mail server.

## Installation and First-Run Flow

Installing creates the site, which takes several minutes: the database schema is built and the
Frappe framework, `telephony` and Helpdesk are each installed in turn. Progress is reported in
three phases driven by `bench`'s own output.

Upstream expects the operator to run Frappe's setup wizard, which is what creates the first
agent account. This package does not: it creates the site non-interactively with a throwaway
Administrator password that is never stored, and hands ownership of the real credential to the
`set-admin-password` action. A critical task holds the service until that action has run, so
the first person to reach the address cannot claim the instance. `Administrator` reaches the
agent portal without an agent record of its own — Helpdesk treats it as an agent by definition.

Frappe's background scheduler is switched on during install. A bench-created site has it off,
and with it off incoming email, SLA status updates, ticket auto-close and search indexing are
all silently dead on a site that otherwise looks healthy — so "email is not arriving" here is a
mail-account problem, not a scheduler one.

A primary address is chosen for the user rather than demanded of them: init picks the `.local`
address at install, so a fresh instance works immediately. It matters because Helpdesk builds
absolute links — ticket updates, agent invitations, customer portal links — and in background
jobs, where that mail is generated, there is no request whose `Host` header it could read. The
`.local` default is fine for testing and useless for anyone outside the network, so a real
deployment runs **Set Primary Address** once a domain or Tor address exists.

Public signup is disabled, which is upstream's default; customers are invited or created from
tickets.

## Actions

Three. One is the credential flow, one decides what the service calls itself in outgoing mail,
one decides how that mail is sent.

**Set Administrator Password** generates a new random password, applies it to the
`Administrator` account, and returns it. Run it once before first sign-in — a critical task
directs the user there — and again whenever the password is lost or should be rotated. Nothing
stores a copy the user can look up afterwards, so a run is the only way to recover access.

It changes only the `Administrator` account's password in the database; every other account is
managed inside Helpdesk. It is safe to repeat, and each run invalidates the previous password.
It takes under a minute, and it runs while the service is stopped because it starts its own
copy of the database to apply the change. Starting the service afterwards is the user's next
step.

**Set Primary Address** records which of the service's addresses goes into emailed links. It is
never required — init picks one — so run it when a `.local` default needs replacing with a real
domain or Tor address. It writes `store.json` only; the value reaches frappe as `host_name` on
the next start, so a change needs a restart to take effect. It is instant and safe to repeat.

**Configure Email (SMTP)** decides how outgoing mail is sent: off, the StartOS system SMTP
server, or a provider the user supplies. Like the address, it is applied on the next start.
Helpdesk validates the relay when it saves the account, so bad credentials leave mail switched
off and log a line beginning `[smtp]` rather than failing the start. It covers **outgoing mail
only** — agent invitations, notifications, password resets. Receiving mail as tickets is
configured by the user inside Helpdesk, and a mailbox set up there takes precedence over this
account for anything sent on a ticket.

## Tasks

One, and it blocks startup.

- **Set the Administrator password** — raised at install, and after any restart, while
  `store.json` holds no Administrator password. Severity `critical`, so the service will not
  start and its ordinary controls are hidden until it clears. Running the
  `set-admin-password` action clears it permanently; it cannot return once a password has been
  issued, because rotating replaces the stored value rather than removing it.

Losing the primary address raises **no** task. Init substitutes the `.local` address and posts a
`warning` notification instead, so the service keeps running and the user is told its emailed
links have become local-only. The write is what stops the notice repeating: it re-runs init,
which then finds a valid address and returns.

## Health Checks

Nine daemons report readiness; one is displayed.

**Web Interface** is the only check a user sees. It probes nginx on port 8080 with a two-minute
grace period, and nginx starts only after gunicorn and socket.io are ready, so it standing at
"not ready" means one of those has not come up rather than that nginx has failed. On a first
start after install this can take a couple of minutes.

The other daemons check themselves without displaying anything: MariaDB through its own
`healthcheck.sh`, each Redis with a `PING`, gunicorn and socket.io by their listening ports. The
scheduler and the two queue workers report ready unconditionally — they expose no port and no
status endpoint, so a stuck worker looks healthy. Background email and SLA processing failing
while the interface is green is the symptom of that; the `scheduler`, `queue-short` and
`queue-long` logs are where it shows.

## Backups and Restore

The strategy is a **plain volume copy** — `db`, `sites` and `main` are captured whole, with no
dump and no database process involved.

StartOS stops the service for the duration of a backup and restarts it afterwards if it had been
running, so the copy is taken against a quiescent data directory. Nothing is excluded: the
database, the uploaded files and the site's encryption key all travel together, and a restored
instance needs nothing re-entered — the Administrator password and every email account come back
with it.

The `db` volume is the bulk of a backup, and its size tracks InnoDB's on-disk footprint rather
than the number of tickets: a site holding a handful of tickets is already a couple of hundred
megabytes across several hundred files.

StartOS reinstalls a restored package stopped, so it has to be started.

## Limitations and Differences

1. **Frappe's setup wizard is bypassed.** The site is created non-interactively, so the wizard
   never runs and never creates the first agent record. Agents are added from Helpdesk's own
   admin screens instead.
2. **The bench's database, redis and socket.io settings are re-asserted on every start** and
   cannot be changed persistently from inside the application.
3. **The `Administrator` password belongs to StartOS.** Changing it from inside Frappe leaves
   the value StartOS stored stale; the action is the supported way to change it.
4. **One site per install.** Frappe supports multi-tenancy; this package pins a single site
   name and a single database name, and offers no way to add another.
5. **Incoming mail is not configured by the package.** `manage-smtp` covers outgoing mail only;
   turning email into tickets needs an IMAP mailbox, which the user sets up inside Helpdesk.
6. **The ERPNext integration is unavailable.** Helpdesk can mirror ERPNext customers into its
   own, but upstream implements it as two apps sharing one Frappe site — it hooks ERPNext's
   `Customer` doctype directly and its settings carry no URL or API key. The StartOS ERPNext
   package is a separate site with a separate database, so there is nothing to point at.
7. **The Frappe framework floats within its release branch at build time.** The Helpdesk app is
   pinned to a release tag, but `telephony` publishes no tags and the framework's branch doubles
   as the tag of the base images, so a rebuild of the same package version can carry newer
   framework code. Published `.s9pk` artifacts are fixed.

---

## Quick Reference for AI Consumers

```yaml
package_id: frappe-helpdesk
image: built from ./Dockerfile (frappe/build + frappe/base), mariadb, redis
architectures: [x86_64, aarch64]
subcontainers:
  - seed-sites
  - mariadb
  - redis-cache
  - redis-queue
  - configurator
  - backend
  - websocket
  - scheduler
  - queue-short
  - queue-long
  - frontend
volumes:
  sites: /home/frappe/frappe-bench/sites
  db: /var/lib/mysql
  main: not mounted
file_models:
  - store.json
startos_managed_env_vars:
  - MYSQL_ROOT_PASSWORD
  - MARIADB_AUTO_UPGRADE
  - BACKEND
  - SOCKETIO
  - FRAPPE_SITE_NAME_HEADER
  - UPSTREAM_REAL_IP_ADDRESS
  - UPSTREAM_REAL_IP_HEADER
  - UPSTREAM_REAL_IP_RECURSIVE
  - PROXY_READ_TIMEOUT
  - CLIENT_MAX_BODY_SIZE
dependencies: none
interfaces:
  ui: { type: ui, port: 8080 }
actions:
  - set-admin-password
  - set-primary-url
  - manage-smtp
tasks:
  - { action: set-admin-password, severity: critical }
health_checks:
  - frontend
```
