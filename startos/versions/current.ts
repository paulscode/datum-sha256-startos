import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const notes =
  'Stop, updates and restarts can no longer be held up by a status check that ' +
  'never finishes: a check still unanswered after a minute says so, and no ' +
  'longer keeps the service from stopping. The same problem made Bitcoin Knots ' +
  '(BLAKE2b) Companion updates hang before its 29.5.0:1. ' +
  'From 1.0.0:5: fixes from independent reviews of the gateway changes. A block found in a ' +
  'quickdiff share for an earlier job is now submitted before the share is ' +
  'refused; before, such a share was refused first, so a block in it could be ' +
  'lost. A second quickdiff on the same job no longer resends identical work: ' +
  "with the commitment held at the pool's minimum it repeated the first one " +
  "exactly, and the rig's resubmitted shares came back as duplicates. A " +
  'quickdiff share for another job is answered as unknown work rather than as ' +
  'a hashing error that reads like a hardware fault. A misaligned memory read ' +
  'in the duplicate-share check is fixed.'

export const current = VersionInfo.of({
  version: '1.0.0:6',
  releaseNotes: {
    en_US: notes,
    es_ES: notes,
    de_DE: notes,
    pl_PL: notes,
    fr_FR: notes,
  },
  migrations: {
    // Nothing to migrate: the SDK changed, and nothing on disk does.
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
