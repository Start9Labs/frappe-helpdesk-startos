# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Fix a defect you spot rather than reporting it** — you have the package open and the
context to be sure. File **a GitHub issue on this repo** only when the call isn't yours to
make: you can't pin the cause down, two defensible fixes exist, or it's too large to ride on
the work in hand. An open issue is a report, not a queue — implement one when you're asked
to or when it's labelled `Approved`, then close it with `Closes #<n>`.

Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

Before changing `startos/main.ts`, read `compose.yaml` and `overrides/` in
<https://github.com/frappe/frappe_docker>: the daemon commands, the env vars and the startup
ordering are taken from there and should stay in step with it.

Things that will bite you:

- **`FRAPPE_BRANCH` has to stay a branch name**, not a version tag: it selects both the git
  branch `bench init` clones and the tag of the `frappe/build` and `frappe/base` images the
  `Dockerfile` starts from. Pinning frappe to a release means pinning those images by digest
  instead.
- **`seed-sites` has to run before everything else** — in `main.ts` and in both init chains. The
  `sites` volume arrives empty and root-owned while the image runs as uid 1000, and
  `sites/assets` is a symlink it re-creates on every start: the build moves the compiled assets
  outside `sites/` because the volume mounts over that path and would hide them.
- **The site is created once, at install**, by a `runUntilSuccess` chain — MariaDB has to be
  running for `bench new-site`, which is why this is not a plain `setupOnInit` step. The database
  name is pinned rather than left to bench, which would otherwise generate a random one per site.
- **`--install-app helpdesk` is enough for Helpdesk**; frappe's `install_app` installs the
  `required_apps` from an app's hooks first, which is how `telephony` gets in. `start9_support`
  is installed after it, and the update chain installs it before `migrate` on a site that
  predates it — `migrate` alone never installs an app.
- **`start9_support` is not in `apps.json`.** It is a subdirectory of `Start9Labs/support-server`,
  a private repository, which `bench get-app` cannot install and an anonymous build cannot clone;
  it comes in as the `support-server` submodule (SSH URL, so it needs Start9 access — `git
  submodule update --init` before packing), and the `Dockerfile` does get-app's work by hand
  (copy into `apps/`, `pip install -e`, the `sites/assets` link). Bump the submodule to move the
  app and the portal together — they are the same commit — and rebuild.
- **The image builds the portal** from that clone's `web/` (an Angular build; needs the network at
  build time and a couple of GB of RAM); nothing is committed. `assets/taiga-ui` is a symlink into
  that build because nginx serves `/assets` from the assets directory and never proxies it.
- **Don't drop `nginx/frappe.conf.template`.** Frappe's socket server rejects a connection whose
  `Host` and `Origin` headers differ and fetches the session from `Origin`; upstream's template
  sends the browser's host and the site name, so live updates only worked when the two matched.
  The override names this nginx (`127.0.0.1:8080`, since every subcontainer shares the network
  namespace) in both. Keep it in step with upstream's template when bumping the image.
- **`bench --site … enable-scheduler` in the install chain is load-bearing.** `bench new-site`
  reads `System Settings.enable_scheduler` before the site it is creating exists, so it always
  writes it back as off.
- **Don't add an action that only displays a stored credential.** One action generates, stores,
  applies and returns it, and the same one rotates it.
- **Don't bootstrap an `HD Agent` for Administrator** — helpdesk's `is_agent()` short-circuits on
  it.
- **Don't hand-roll a database dump.** `sdk.Backups.withMysqlDump` is the fleet's dump path and
  the right destination here, but it cannot drive a MariaDB 11.x image until
  start-technologies#3915 ships in SDK 3.0 — it shells out to `mysqld`/`mysqladmin`/`mysqldump`,
  which the image no longer carries (start-technologies#3766).
- **Converting to `withMysqlDump` has to answer which credential it runs as.** `MysqlDumpConfig`
  takes a single `user`/`password`; this site has two. The MariaDB root password is generated by
  the package and lives in `store.json`; the site user's is generated by `bench` and lives in the
  site's `site_config.json`, where frappe writes `db_name` and `db_password` but **no `db_user`**
  before version 16 — the user is the database name. A restore has to leave the site user able to
  authenticate with the password frappe already has. `ghost` passes `user: 'root'`; whether that
  suffices here is untested.
- **Bumping the image means a schema migration.** `bench migrate` runs on `kind === 'update'`
  inside init, where a failure rolls the update back. Do not move it to a oneshot in `main`.
- **Credentials never go on a command line** — `bench` reads them from the environment so they
  stay out of the process table and the service log.
- **Install progress phases are driven by `bench`'s own stdout** — `Installing frappe...`,
  `Installing helpdesk...`, and its `Updating DocTypes … NN%` bars. Re-check those strings when
  bumping the image: a reword leaves a bar indeterminate instead of failing anything, so nothing
  else will tell you.
- **Don't drop the NLTK corpora from the image.** Without them the scheduler retries a download
  from the internet on every tick.
- **Losing the primary address falls back to `.local` and notifies; it must not raise a task.**
  A helpdesk that stops answering because a domain lapsed is worse than one emailing local links.
  The fallback write is also what stops the notice repeating — it re-runs init, which then finds
  a valid address and returns early.
- **`host_name` must be an origin.** frappe appends its own paths to it, while the interface's
  formatted URLs carry the `/helpdesk` suffix — hence `format('url').map(u => u.origin)`.
- **`preferredLauncherAddress` on the `ui` interface wants adding at the SDK 3.0 bump** — it does
  not exist in 2.0.9. It makes **Open UI** use the address the site is configured for.
- **Don't give the `StartOS` email account an IMAP folder.** Helpdesk picks a sending account in
  three steps (`helpdesk/utils/email.py`): the mailbox the customer wrote to, then one whose
  `imap_folder` appends to `HD Ticket`, then any `default_outgoing`. Being outgoing-only is what
  keeps it at step three, behind whatever the user configures.
