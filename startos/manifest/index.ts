import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'
import { knotsDependencyDescription } from './i18n-dependency'

export const manifest = setupManifest({
  // Deliberately NOT `datum`: that is the official Datum Gateway package, and
  // all three must be installable at once — the official one against your
  // primary node, this one against the SHA256 companion, and `datum-blake2b`
  // against the BLAKE2b companion.
  //
  // `datum-sha256`, not `datum-prerdts`, even though the node it depends on is
  // `knots-prerdts`. That id predates the rename and cannot be changed; this one
  // is new, so it gets to say what it is from the start. The two disagree, which
  // is a small ugliness paid once here rather than a wrong name carried forever.
  id: 'datum-sha256',
  title: 'Datum Gateway (SHA256) Companion',
  license: 'MIT',
  packageRepo: 'https://github.com/paulscode/datum-sha256-startos',
  upstreamRepo: 'https://github.com/OCEAN-xyz/datum_gateway',
  marketingUrl: 'https://ocean.xyz',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    datum: {
      source: {
        dockerBuild: {
          dockerfile: 'Dockerfile',
          workdir: '.',
          // No buildArgs on purpose. The upstream ref belongs in exactly one
          // place, and that place is the Dockerfile's ARG defaults. Setting it
          // here as well silently overrode them: the Dockerfile was moved to a
          // pinned commit and this was left on a floating branch, so every
          // StartOS build kept fetching the old fork tip while the Umbrel and
          // plain-Docker images, which have no such override, moved correctly.
          // Two releases shipped with notes describing a change they did not
          // contain. One source of truth, and this is not it.
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    // The SHA256 companion, not the official `bitcoind`.
    //
    // Unlike the BLAKE2b package, this is not a correctness requirement about
    // which chain gets mined: `knots-prerdts` follows the same chain the
    // official node does, so templates from either would be valid. It is a
    // requirement about which node this gateway can reach at all. StartOS
    // resolves a dependency by id, and pointing it at `bitcoind` would mean
    // depending on a package the user may not have, while the companion is the
    // one this pairs with.
    //
    // The practical difference the companion makes is BIP-110: it never
    // enforces RDTS, so if the network splits over it, blocks this gateway
    // builds follow the side that does not require it.
    'knots-prerdts': {
      description: knotsDependencyDescription,
      optional: false,
      metadata: {
        title: 'Bitcoin Knots (SHA256) Companion',
        // A dependency icon is an absolute URL into the dependency's repo, not a
        // magic filename, so PNG is fine (E9). It is fetched by the StartOS UI,
        // which means the packaging repo has to be public for it to render.
        // `main`, not a pinned commit, matching what electrs-pruned and
        // mempool-pruned already do for this same icon.
        //
        // A pinned SHA was tried first and is the wrong trade here. This URL is
        // fetched at BUILD time, so a SHA that is not yet pushed fails the build
        // outright, and one that is pushed goes stale the moment the icon is
        // re-banded, which is exactly what just happened when the node was
        // renamed to SHA256. Floating on main costs nothing: the file is a
        // 128px icon, and the failure mode of it changing is that the
        // dependency prompt shows a newer icon.
        icon: 'https://raw.githubusercontent.com/paulscode/knots-prerdts-startos/main/dep-icon.png',
      },
    },
  },
})
