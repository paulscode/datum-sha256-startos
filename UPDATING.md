# Updating the upstream version

DATUM Gateway is **built from source, from a fork, pinned by commit**. There is no
`dockerTag` in the manifest and no release tarball: the pin is the `DATUM_REF` ARG in
[Dockerfile](Dockerfile).

```dockerfile
ARG DATUM_REPO=https://github.com/paulscode/datum_gateway.git
ARG DATUM_REF=0c51cc63baac73046fdea394795d0ecb063c47fc
```

**A commit, not a branch or a tag.** A branch name is a moving target, and this is the one
input that decides whether the work handed to an ASIC matches consensus. The commit is
written to `/src/PINNED_COMMIT` during the build, so the running image always states what
it actually built.

## Two upstreams, not one

`paulscode/datum_gateway` is a fork of [`OCEAN-xyz/datum_gateway`](https://github.com/OCEAN-xyz/datum_gateway),
and both matter. The pinned commit is on the fork's `ocean-sha256-2` branch: OCEAN master
with our own commits rebased on top. The fork's `master` is the older line, which also
carried the BLAKE2b mining code; this package no longer builds from it.

**Is the fork behind OCEAN?** Compare the pin against OCEAN's default branch. `ahead_by`
counts what OCEAN has that the pin does not:

```sh
gh api repos/OCEAN-xyz/datum_gateway/compare/<DATUM_REF>...master \
  --jq '"ahead_by=\(.ahead_by) behind_by=\(.behind_by)"'
```

At the 2026-10-17 pin this reads `ahead_by=0 behind_by=4`: OCEAN has nothing the fork
lacks, and the fork carries four commits of its own. `ahead_by` going up is OCEAN
releasing something to rebase onto.

**What are the fork's own commits, and are they upstreamed?** Open PRs against OCEAN are
the ones that can retire:

```sh
gh pr list -R OCEAN-xyz/datum_gateway --author paulscode --state all
```

A carried change that OCEAN merges should be dropped from the fork on the next rebase
rather than left to conflict. The minimum difficulty commit is OCEAN #234; the local share
counts and reject reasons have not been proposed upstream.

## Applying the bump

1. Rebase the branch onto OCEAN master and build it with `-Wall -Werror`, gcc and clang,
   `ENABLE_API` on and off, and run `--test` under the sanitizers.
2. Push the new work to `paulscode/datum_gateway` first. The build fetches the ref from
   GitHub with `--depth 1`, so an unpushed local commit fails the build rather than
   silently building something else.
3. Update `DATUM_REF` in `Dockerfile` to the full 40-character SHA.
4. Check the generated config in `entrypoint.sh` against the gateway's option table
   (`src/datum_conf.c`). The gateway ignores keys it does not know, so a removed option
   fails silently rather than at startup.
5. `datum-blake2b-startos` builds a different gateway line and has its own pin. Its
   packaging fixes usually apply here; its gateway bumps do not.

## What is not tracked here

Nothing about the chain is pinned in this file. OCEAN's gateway mines SHA256d only, and
which SHA256 chain it mines is decided by the node it depends on.

The node's own pin is not tracked here either. `knots-prerdts` is fixed at Bitcoin Knots
`29.3.knots20260507` and will not move, because the Knots developers have confirmed there
will be no further non-RDTS release. See that package's `UPDATING.md`.
