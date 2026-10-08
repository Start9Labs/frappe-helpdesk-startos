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
`instructions.md` (end-user docs) in sync with your changes. This file restates neither:
whoever changes the package has both, so it carries only what they don't — repo mechanics,
a change that looks right and is not, where the next thing gets added, a naming trap, a
build or test invocation particular to this repo.

**Fix a defect you spot rather than reporting it** — you have the package open and the
context to be sure. File **a GitHub issue on this repo** only when the call isn't yours to
make: you can't pin the cause down, two defensible fixes exist, or it's too large to ride on
the work in hand. An open issue is a report, not a queue — implement one when you're asked
to or when it's labelled `Approved`, then close it with `Closes #<n>`.

Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **Keep `startos/main.ts` in step with `compose.yaml` and `overrides/` in
  <https://github.com/frappe/frappe_docker>** — the daemon commands, env vars and startup ordering
  are taken from there.
- **`FRAPPE_BRANCH` has to stay a branch name**, not a version tag: it also selects the tag of the
  `frappe/build` and `frappe/base` images the `Dockerfile` starts from. Pinning frappe to a release
  means pinning those images by digest instead.
- **`seed-sites` has to run before everything else**, in `main.ts` and in both init chains — the
  `sites` volume arrives empty and root-owned, and `sites/assets` is a symlink it re-creates.
- **Keep site creation in its `runUntilSuccess` chain**, not a plain `setupOnInit` step:
  `bench new-site` needs MariaDB running.
- **`--install-app helpdesk` is enough** — frappe installs an app's `required_apps` first, which is
  how `telephony` gets in.
- **Don't drop `enable-scheduler` from the install chain.** `bench new-site` always writes the
  scheduler back as off.
- **Don't add an action that only displays a stored credential.** One action generates, stores,
  applies and returns it, and the same one rotates it.
- **Don't bootstrap an `HD Agent` for Administrator** — helpdesk's `is_agent()` short-circuits on
  it.
- **Keep backups as a copy of the `db`, `sites` and `main` volumes; don't move them to
  `withMariadbDump` or hand-roll a dump.** StartOS stops the service for a backup, so the
  data-directory copy is consistent. A dump adds a MariaDB process and SQL at both ends, and its
  restore would have to keep two credentials working: the MariaDB root password in `store.json`,
  and the site user's, which `bench` writes into `site_config.json` with **no `db_user`** before
  frappe 16. Slow restores were a StartOS bug fixed in 0.4.0.2 (start-technologies#3779), not a
  reason to dump.
- **Keep `bench migrate` in init on `kind === 'update'`**, where a failure rolls the update back —
  never in a oneshot in `main`.
- **Credentials never go on a command line** — pass them to `bench` through the environment.
- **Re-check `bench`'s stdout markers when bumping the image** (`Installing frappe...`,
  `Installing helpdesk...`, `Updating DocTypes … NN%`): they drive the install progress phases, and
  a reword leaves a bar indeterminate without failing anything.
- **Don't drop the NLTK corpora from the image** — the scheduler would retry the download on every
  tick.
- **`host_name` must be an origin** — frappe appends its own paths, while the interface's URLs carry
  `/helpdesk`. Pass `new URL(url).origin` of `bestUsable`.
- **Don't give the `StartOS` email account an IMAP folder.** Being outgoing-only is what keeps it
  behind any mailbox the user configures (`helpdesk/utils/email.py`).
