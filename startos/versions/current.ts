import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const notes = `Fixes a fault that could start rejecting your shares after several hours of mining.

The gateway keeps a table of recently seen shares so it can recognise a duplicate. The first time that table filled up, it corrupted its own index of it, and nothing put that right short of restarting the gateway. How long that takes depends on how many shares your miners send: a few hours is typical, sooner with more of them connected. If you have seen your reject rate climb out of nowhere and then clear when you restarted the gateway, this is the likely cause.

Alongside the fix, the status page now says why shares were refused rather than only how many. A new "Rejected Because" line under the rejected total lists the reasons that have actually happened, worst first, and reads "None" when there are none. The Clients page gains a "Last Reject" column, which is what tells one badly configured miner apart from something affecting everything at once. The names are the same ones your miner's own log shows, so the two can be read side by side.

This version needs Bitcoin Knots (pre-RDTS) 29.3:29 or later. Earlier node releases read the RPC cookie only once, so after the node's next restart every request from this service failed until both were restarted.

Two settings now say what the gateway actually does with them. Work Update Seconds accepts 5 or more, because the gateway has always raised anything lower to 5; a saved value below that now shows as 5. The minimum difficulty is rounded down to a power of two before it reaches the gateway, which did the same rounding itself but complained about it in the log on every start.

You do not need to reconfigure your miners.`

export const current = VersionInfo.of({
  version: '1.0.0:2',
  releaseNotes: {
    en_US: notes,
    es_ES: notes,
    de_DE: notes,
    pl_PL: notes,
    fr_FR: notes,
  },
  migrations: {
    // Nothing to migrate. The dupe table is rebuilt from nothing on every start,
    // so the corrupted state this fixes cannot survive the restart that installing
    // this performs, and the new reject counters start at zero by the same route.
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
