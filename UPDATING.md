# Updating the upstream version

Upstream is the **Frappe Helpdesk application**, and this package builds its own image rather
than pulling one. `apps.json` is the pin: `bench init` clones the apps listed there into a bench
built on the `frappe/build` and `frappe/base` images, and `Dockerfile`'s `FRAPPE_BRANCH` selects
both the framework branch and the tag of those two base images.

The image upstream publishes at `ghcr.io/frappe/helpdesk` is not usable — see `AGENTS.md` — so
there is no image tag to track.

## Determining the upstream version

The package version's upstream part is the Helpdesk release tag, without its `v`:

```bash
gh release view -R frappe/helpdesk --json tagName -q .tagName
```

Two things move independently of it and are not pinned to a release:

- **`telephony`**, which Helpdesk requires, publishes no tags at all. `apps.json` tracks its
  `develop` branch.
- **The Frappe framework** floats within `FRAPPE_BRANCH`. It cannot be pinned to a release tag
  without also pinning `frappe/build` and `frappe/base` by digest, because that branch name is
  their image tag. Check Helpdesk's `pyproject.toml` (`[tool.bench.frappe-dependencies]`) before
  moving to a newer branch.

## Applying the bump

1. Set the Helpdesk `branch` in `apps.json` to the new tag, `v`-prefixed.
2. Set `version` in `startos/versions/current.ts` to the release without its `v`, with a `:0`
   downstream revision, and write its release notes.
3. Rebuild and reinstall on a StartOS box. The bump runs `bench migrate` during init, so confirm
   an installed instance survives the update, not just a fresh install.

Re-check the progress markers in `startos/init/bootstrapHelpdesk.ts` when the framework branch
moves: they match `bench`'s own `Installing frappe...` / `Installing helpdesk...` output and its
`Updating DocTypes … NN%` bars. A reword leaves a progress bar indeterminate without failing
anything, so nothing else will report it.
