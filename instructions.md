# Frappe Helpdesk

## Documentation

- [Frappe Helpdesk documentation](https://docs.frappe.io/helpdesk/*) — the upstream guide to agents, teams, customers, email, service level agreements and the knowledge base.

## What you get on StartOS

A single Frappe Helpdesk site with its database, cache, background workers and web server, all
behind one web interface. StartOS owns the Administrator password, the address Helpdesk puts in
the links it emails, and how outgoing mail is sent. Everything else — agents, customers, SLAs,
the knowledge base and the mailbox tickets arrive on — is set up inside Helpdesk exactly as
upstream describes.

The address opens on the Start9 support portal, a chat-style front for your customers built on
Helpdesk by the `start9_support` app. Helpdesk itself — the agent portal for staff, its own
customer portal, settings, reports — is at `/helpdesk` on the same address, and the Frappe desk at
`/app`.

## Getting set up

Installing takes several minutes: Helpdesk builds its database and installs its application
before it will start. The progress bar tells you where it is.

1. Run the **Set Administrator Password** action and copy the password it shows you. This is
   the only time it is displayed, and Helpdesk will not start until you have run it.
2. Start Helpdesk and open its **Web UI** interface, then add `/helpdesk` to the address.
3. Sign in with the username `Administrator` and that password.

Before you invite anyone or connect a mailbox, give the **Web UI** interface an address people
outside your network can reach — add a domain, or enable it on Tor — then run **Set Primary
Address** and pick it. Helpdesk puts that address in every link it emails, and it starts out
using your local one, which nobody outside your network can open.

You are now in the agent portal, with a sample ticket waiting to show you how the interface
works.

## Using Frappe Helpdesk

Everything after sign-in is standard Frappe Helpdesk, and the upstream documentation applies in
full. Three things are worth doing early.

### Connect your support email

This is the feature most people install Helpdesk for: mail sent to your support address becomes
a ticket, and an agent's reply goes back to the customer as email. Open **Settings** inside
Helpdesk, then **Email Accounts**, and add your mail provider's details. Helpdesk checks the
credentials when you save, so a mistake tells you straight away.

This is separate from the **Configure Email (SMTP)** action, which only decides how Helpdesk
*sends* mail. A mailbox you set up here takes precedence over it for anything sent on a ticket,
which is what you want — replies then come from your support address and land back on the
ticket.

### Invite your agents

Add the people who will answer tickets under **Settings → Invite Agents**. Each one gets an
email invitation and their own sign-in; do not share the `Administrator` account. Customers do not
need inviting — they are created from the tickets they raise, and public signup is turned off.

### Write a few help articles

**Knowledge Base** in the sidebar is what customers search before they open a ticket, and what
Helpdesk searches when suggesting replies to your agents.

### Actions

**Set Administrator Password** generates a new random password, applies it, and shows it to
you. Run it again whenever you need a new one — it is the only way to recover a lost
Administrator password, because nothing stores a copy you can look up. It affects only the
`Administrator` account; everyone else is managed inside Helpdesk under **Settings → Agents**.

**Set Primary Address** chooses which of Helpdesk's addresses goes into the links it emails.
Restart afterwards for the change to take effect. If the address you picked ever goes away,
Helpdesk falls back to your local one and tells you so — pick another when that happens.

**Configure Email (SMTP)** decides how Helpdesk sends agent invitations, notifications and
password resets:

- **Disabled** — Helpdesk sends no mail of its own. This is the default.
- **System Credentials** — the SMTP server configured once for your whole server in StartOS.
- **Custom Credentials** — your own provider: host, port, whether it uses TLS or STARTTLS, the
  address mail comes from, and your username and password.

The setting applies the next time Helpdesk starts, so restart afterwards. If the details are
wrong, Helpdesk refuses them and carries on with sending switched off rather than failing to
start — check the service logs for a line beginning `[smtp]`.

### Backups

A backup contains your tickets and their history, your contacts and customers, your help
articles, every file attached to a ticket, your email account settings, and the key that
decrypts the stored passwords. It restores to exactly the site you backed up, Administrator
password included. Restoring leaves Helpdesk stopped, so start it afterwards.

## Troubleshooting

**The web interface never becomes healthy.** The database and application server start before
the web server does; give it a few minutes on first run. If it stays unhealthy, the service
logs from the `mariadb` and `backend` containers say why.

**Tickets are not arriving from email, or replies are not going out.** Email is handled by
background workers that have no health indicator of their own. Look for `queue-short`,
`queue-long` and `scheduler` in the service logs, and check the account under
**Settings → Email Accounts** is still enabled.

**Response and resolution timers look wrong.** Those are driven by the service level agreement
and its holiday list. Check the working hours under **Settings → SLA Policies** and
**Settings → Business Holidays** before assuming the timers are broken.
