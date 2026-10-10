# datum-sha256

DATUM Gateway packaged for StartOS 0.4.0.x, mining the **SHA256 chain** against
[`knots-prerdts`](https://github.com/paulscode/knots-prerdts-startos), the
Bitcoin Knots companion that never enforces BIP-110.

Maintained by Paul Lamb (<https://github.com/paulscode>). Not affiliated with
Start9 or OCEAN.

## Why this exists

DATUM builds block templates on your own node instead of taking a pool's. That
is worth something on its own, and there is already an official Datum Gateway
package that does it against the official `bitcoind`.

What this adds is *which node*. StartOS resolves a dependency by package id, so
the official gateway can only be pointed at the official node. This one pairs
with the SHA256 companion, and that companion is the one that never enforces
RDTS. If the network splits over BIP-110, the blocks this gateway builds follow
the side that does not require it.

Both can be installed at once, along with `datum-blake2b`: one gateway on your
primary node, one on the SHA256 companion, one on the BLAKE2b companion.

## Relationship to `datum-blake2b`

This package is a fork of
[`datum-blake2b`](https://github.com/paulscode/datum-blake2b-startos), which is
itself aligned to the official Datum Gateway package's action list, health-check
names and interface names. So this inherits that alignment rather than
re-deriving it.

**The image is byte-identical in intent: same Dockerfile, same pinned commit.**
That fork of DATUM carries nothing of its own any more; it is a mirror of OCEAN
upstream, and upstream DATUM speaks both algorithms. `pow_algorithm` is left at
`auto`, which takes the algorithm from the node's template, and against this node
that always resolves to SHA256d.

What differs:

| | `datum-blake2b` | this package |
|---|---|---|
| depends on | `knots-blake2b` | `knots-prerdts` |
| dependency health check | `node` | `bitcoind` |
| dependency version range | `>=1.0.0` | `>=#knotsprerdts:29.3:29` |
| stratum / dashboard | 23336 / 7153 | 23338 / 7154 |
| pooled mining | impossible | supported |
| plain-Docker compose | ships one | none |

Two of those rows are traps rather than choices, and both were found by checking
rather than by copying:

**The health check id.** `knots-blake2b` renamed its daemon to `node` because
three dependents already named it. `knots-prerdts` is a thin fork of the official
Knots package and never renamed anything, so its daemon is `bitcoind`. StartOS
treats a required health check id that does not exist exactly like one that is
failing, and it shows up in the Dependencies section rather than anywhere the
node's own health output would reveal.

**The version range.** `knots-prerdts` versions are flavored
(`#knotsprerdts:29.3:N`), and **a flavored version never satisfies an unflavored
range**. Copying `>=1.0.0` across would have produced a dependency that matches
nothing at all. Verified with the SDK's own comparator:

```
#knotsprerdts:29.3:27 vs >=#knotsprerdts:29.3:25  => true
#knotsprerdts:29.3:27 vs >=1.0.0                  => false
```

## Pooled mining works here

The BLAKE2b sibling refuses pool settings because no DATUM pool can validate a
BLAKE2b share. This gateway builds SHA256d templates, which is exactly what every
DATUM pool validates, so the **DATUM Pool** config action is a real setting.
Leave it empty to mine solo; fill it in to mine to a pool while still building
your own templates.

## No plain-Docker compose

`datum-blake2b` ships a `docker/` directory because both halves of that pair are
published images. There is no published Docker image for the SHA256 node: its
package builds bitcoind from a signed release tarball inside the s9pk build and
never pushes it to a registry. Shipping a compose file naming an image that does
not exist would be worse than shipping none.

## Ports

23338 (stratum) and 7154 (dashboard), chosen so the official `datum`
(23334/7152), `datum-blake2b` (23336/7153) and this one can all be installed at
once. 23335 was skipped because it was observed not to be honoured as a preferred
external port on the lab box, with no cause identified; 23337 was
`datum-blake2b`'s compatibility-capture port until that feature was removed, and
reusing a number that appears in that package's docs under a different meaning is
a confusion not worth saving a port for.

`preferredExternalPort` is a request, not a reservation. **Read the address off
the Interfaces tab** rather than assuming these.

## Credentials

None are stored. The node writes an RPC cookie into its data directory and this
package reads it through a read-only mount of the node's volume, so neither side
generates, stores or hands around an RPC secret. The cookie sits at the root of
that volume on both companions, even though the two nodes put their data
directory at different paths inside their own containers (`/data` for BLAKE2b,
`/root/.bitcoin` for this one).

The dashboard's admin password is separate and is generated on install; see
**Dashboard Password**.

## Build

```
make ARCHES=x86            # build the s9pk (install does NOT rebuild it)
make ARCHES=x86 install    # install to the host in .startos/config.yaml
```

After changing any `i18n('...')` string, regenerate the dictionary:

```
python3 scripts/gen-i18n-dict.py .
```

That script is append-only: indices are the join key for `translations.ts`, and
renumbering would silently attach a translation to a different English string
rather than fail. This package's translations are empty today, so it would be
safe to regenerate, but the script is shared with packages where it is not.
