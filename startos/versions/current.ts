import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const notes =
  'Rented rigs keep their own difficulty. With "Serve miners below the pool\'s ' +
  'minimum difficulty" (Stratum settings, on by default), each miner gets a ' +
  "difficulty that suits its hashrate even when the pool's minimum is far higher. " +
  "Work is still committed at the pool's minimum and only shares meeting it are " +
  'sent to the pool, so pool credit is unchanged. Vardiff now measures at the ' +
  'difficulty it serves, which stops large overshoots after a step up. A ' +
  'connection that opens with a TLS handshake is closed at once, so the ' +
  'MiningRigRentals pool test no longer reports a working endpoint as failing. ' +
  'The gateway answers datum.capabilities, so Pickhash can tell what it ' +
  'supports. Both settings are on by default and can be turned off in ' +
  'Stratum settings: "Serve miners below the pool\'s minimum difficulty", ' +
  'and "Let miners request a difficulty in the Stratum password", which this ' +
  'package has always switched on and now offers as a setting. ' +
  'Rebuilt on version 3 of the StartOS packaging SDK, which needs StartOS ' +
  '0.4.0.2. ' +
  'The gateway is now built from the current OCEAN DATUM Gateway source, ' +
  'which brings two months of upstream fixes. ' +
  'It checks the length of every message from a DATUM pool before reading ' +
  'it, and drops pool messages that are not encrypted the way it expects. ' +
  'The dashboard now protects its settings forms with a random token, ' +
  'rather than one derived from your configuration. ' +
  'A race that could make the gateway miss a pool’s coinbase reply and wait ' +
  'five seconds for nothing is fixed. ' +
  'The queue of shares waiting for the pool now survives a reconnect safely, ' +
  'instead of being rebuilt while still in use. ' +
  'Shares sent before a miner has subscribed, or for work the gateway never ' +
  'handed out, are now refused. ' +
  'The dashboard shows the gateway version, and a JSON API is available ' +
  'under /v1/ on the dashboard port. ' +
  'A difficulty request in the Stratum password (d=N) now rounds up to a ' +
  'power of two and never goes below the minimum share difficulty, and ' +
  'fd=N is no longer supported. ' +
  'Pooled mining has always worked here, and the warnings that said ' +
  'otherwise are gone, as is the BLAKE2b wording on the Stratum address. ' +
  'Nothing you have set changes, apart from serving miners below the pool ' +
  'minimum, which is switched on as described above.'

export const current = VersionInfo.of({
  version: '1.0.0:4',
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
