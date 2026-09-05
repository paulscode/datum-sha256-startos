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

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **This is a fork of `datum-blake2b-startos`, and most of it is shared.** Same `paulscode/datum_gateway` commit, same `entrypoint.sh` shape, same `RESERVED` safety rail, same no-default-payout-address rule. Read that package's `AGENTS.md`: every bullet there applies here unless this file contradicts it. A fix in one is almost always a fix in both.
- **The chain is not baked into the image.** Both packages leave `mining.pow_algorithm` at `auto`, so the gateway takes SHA256d or BLAKE2b from whichever node it is pointed at. What makes this package the SHA256 one is the node it depends on, nothing in the build.
- **The dependency is `knots-prerdts`, and its health check is `bitcoind`, not `node`.** That package is a fork of the official bitcoind lineage and keeps its ids; the BLAKE2b companion is a separate lineage whose daemon is `node`. StartOS treats a required health check id that does not exist exactly like a failing one, so getting this wrong shows "Required health check not passing" forever with no name to display.
- **The `versionRange` is flavored on purpose.** `>=#knotsprerdts:29.3:25` matches that package's own flavored versions directly. An unflavored range like `>=29.3:25` would not match them at all and would instead gate on the unflavored versions it declares through `satisfies` — a different question with a different answer. Checked with the SDK comparator, not reasoned about: `#knotsprerdts:29.3:27` satisfies the flavored range and fails the unflavored one.
- **Ports are deliberately distinct from both the official Datum app and the BLAKE2b companion**, so all three install on one server. Stratum is 23338 here, 23336 on the BLAKE2b companion, 23334 upstream.