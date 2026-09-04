import { getaddress } from 'knots-prerdts-startos/startos/actions/getaddress'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  // Point the user at the node's action for getting an address. Without this the
  // Set Payout Address form asks for something the box gives you no way to
  // obtain: the only other route is bitcoin-cli over SSH.
  //
  // `getaddress` (id `get-address`), not the `getPayoutAddress` this used to
  // name. That action was replaced by the official Get Address, which also
  // returns bech32 and is therefore still an address DATUM can pay to.
  await sdk.action.createTask(
    effects,
    'knots-prerdts',
    getaddress,
    'important',
    {
      reason: i18n('Get an address from your node to receive block rewards'),
    },
  )

  return {
    // Our node, never the official `bitcoind`. Depending on `bitcoind` would bind
    // this gateway to the user's mainnet node and generate templates for the
    // wrong chain, which a Sia miner cannot mine and the node would reject.
    //
    // 'running' rather than 'exists': the gateway needs live templates, not just
    // an installed node. This drives the warning UI only; it does not gate
    // startup.
    'knots-prerdts': {
      kind: 'running',
      // Flavored, and it has to be: `knots-prerdts` versions are
      // `#knotsprerdts:29.3:N`, and a flavored version never satisfies an
      // unflavored range. `>=1.0.0` would match nothing at all.
      versionRange: '>=#knotsprerdts:29.3:25',
      // `bitcoind`, not `node`. This package's sibling requires `node`, because
      // the BLAKE2b node kept that id as its published contract with three
      // dependents. `knots-prerdts` is a thin fork of the official Knots
      // package and never renamed anything, so its daemon is `bitcoind`.
      //
      // StartOS treats a required health check id that does not exist exactly
      // like one that is failing, so getting this wrong shows a failed
      // dependency against a node that is perfectly healthy, and shows it in the
      // Dependencies section rather than anywhere the node's own health output
      // would reveal. Checked against the node's main.ts rather than assumed.
      healthChecks: ['bitcoind'],
    },
  }
})
