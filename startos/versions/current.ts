import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const notes =
  'First release. ' +
  ' ' +
  'A DATUM Gateway that mines the SHA256 chain against Bitcoin Knots (SHA256) ' +
  'Companion, the node that never enforces BIP-110. If the network splits over ' +
  'that rule, blocks this gateway builds follow the side that does not require ' +
  'it. ' +
  ' ' +
  'It installs alongside the official Datum Gateway rather than replacing it, ' +
  'so you can point one gateway at your primary node and this one at the ' +
  'companion. Its Stratum port is 23338 and its dashboard 7154, chosen so all ' +
  'three Datum services can run at once. ' +
  ' ' +
  'The settings, their groupings and their names follow the official package, ' +
  'so anyone who knows that one finds the same things in the same places. Set a ' +
  'payout address before you mine: solo mining pays a found block’s whole ' +
  'subsidy to the address configured here, and the service will not start until ' +
  'one is set.'

export const current = VersionInfo.of({
  version: '1.0.0:0',
  releaseNotes: {
    en_US: notes,
    es_ES: notes,
    de_DE: notes,
    pl_PL: notes,
    fr_FR: notes,
  },
  migrations: {
    // Nothing to migrate into: this is the first version of a new package.
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
