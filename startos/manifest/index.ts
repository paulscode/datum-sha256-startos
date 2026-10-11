import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

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
  // StartOS 0.4.0.2, not the SDK's default, so the registry hides releases from
  // older servers. Every release from 2026-10-11 on targets 0.4.0.2.
  osVersion: '0.4.0.2',
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
})
