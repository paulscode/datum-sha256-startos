import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const notes = `This version needs Bitcoin Knots (pre-RDTS) 29.3:29 or later. Earlier node releases read the RPC cookie only once, so after the node's next restart every request from this service failed until both were restarted.

Two settings now say what the gateway actually does with them. Work Update Seconds accepts 5 or more, because the gateway has always raised anything lower to 5; a saved value below that now shows as 5. The minimum difficulty is rounded down to a power of two before it reaches the gateway, which did the same rounding itself but complained about it in the log on every start.

Nothing else changes, and you do not need to reconfigure your miners.`

export const current = VersionInfo.of({
  version: '1.0.0:3',
  releaseNotes: {
    en_US: notes,
    es_ES: notes,
    de_DE: notes,
    pl_PL: notes,
    fr_FR: notes,
  },
  migrations: {
    // Nothing to migrate. The dependency floor is checked by StartOS, and a
    // saved Work Update Seconds below 5 is shown as 5 when the form is read.
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
