# Updating the upstream version

Upstream is the **Frappe Helpdesk application**, and this package builds its own image rather
than pulling one. Every input is pinned in `Dockerfile`: the `frappe/build` and `frappe/base`
images by digest, and the Frappe framework, `telephony` and Helpdesk by full commit SHA
(`FRAPPE_COMMIT`, `TELEPHONY_COMMIT`, `HELPDESK_COMMIT`). `apps.json` only points `bench init`
at the local copies the `Dockerfile` fetches; it carries no version.

This package builds its own image for both supported architectures, so upstream's
`ghcr.io/frappe/helpdesk` image tag is not the artifact to track.

## Determining the upstream version

The package version's upstream part is the Helpdesk release tag, without its `v`. List tags and
release metadata rather than relying on GitHub's Latest badge, select the highest stable
application version, excluding asset tags and prereleases, and confirm its source tag resolves
before pinning it (`TAG` is the selected `v`-prefixed release tag):

```bash
gh api repos/frappe/helpdesk/tags --paginate --jq '.[].name'
gh api repos/frappe/helpdesk/releases --paginate --jq '.[] | [.tag_name, .prerelease, .draft] | @tsv'
git ls-remote https://github.com/frappe/helpdesk.git "refs/tags/$TAG"
```

Helpdesk's stable release lines now match the Frappe framework major: `v15.*` uses
`version-15`, and `v16.*` uses `version-16`. The package follows the newest stable line.
The initial `v16.0.0` source tag has no GitHub release entry; compare tags for its changes.

Helpdesk's `pyproject.toml` (`[tool.bench.frappe-dependencies]`) states the framework and
`telephony` ranges it needs; check it at the selected tag before moving either pin across a major.

## Applying the bump

Refresh every pin in the same change, so the framework, `telephony` and the base images are
re-reviewed alongside Helpdesk.

1. **Helpdesk** — set `HELPDESK_COMMIT` to the commit the selected tag points at (the `^{}` line
   when the tag is annotated):

   ```bash
   git ls-remote https://github.com/frappe/helpdesk.git "refs/tags/$TAG" "refs/tags/$TAG^{}"
   ```

2. **Frappe framework** — set `FRAPPE_COMMIT` to the commit of the newest framework release tag
   of Helpdesk's major (`v16.*`), resolved the same way:

   ```bash
   git ls-remote --tags --refs https://github.com/frappe/frappe.git 'v16.*' | sort -t/ -k3 -V | tail -1
   git ls-remote https://github.com/frappe/frappe.git "refs/tags/$FRAPPE_TAG" "refs/tags/$FRAPPE_TAG^{}"
   ```

3. **`telephony`** publishes no tags; set `TELEPHONY_COMMIT` to the head of its `develop` branch:

   ```bash
   git ls-remote https://github.com/frappe/telephony.git refs/heads/develop
   ```

4. **Base images** — set the digest on both `FROM` lines to the current index digest of the
   `version-NN` tag (the top-level `Digest:`, which covers both architectures):

   ```bash
   docker buildx imagetools inspect frappe/build:version-16
   docker buildx imagetools inspect frappe/base:version-16
   ```

   Moving to a new framework major changes the tag on both `FROM` lines too; confirm both images
   publish it for both supported architectures first.
