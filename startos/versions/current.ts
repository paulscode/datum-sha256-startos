import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const notes =
  'Fixes from independent reviews of the gateway changes. A block found in a ' +
  'quickdiff share for an earlier job is now submitted before the share is ' +
  'refused; before, such a share was refused first, so a block in it could be ' +
  'lost. A second quickdiff on the same job no longer resends identical work: ' +
  "with the commitment held at the pool's minimum it repeated the first one " +
  "exactly, and the rig's resubmitted shares came back as duplicates. A " +
  'quickdiff share for another job is answered as unknown work rather than as ' +
  'a hashing error that reads like a hardware fault. A misaligned memory read ' +
  'in the duplicate-share check is fixed.'

export const current = VersionInfo.of({
  version: '1.0.0:5',
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
