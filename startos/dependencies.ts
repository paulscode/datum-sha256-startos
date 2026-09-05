import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  // Clear the task this service used to create against the node's Get Address.
  //
  // StartOS does not garbage-collect tasks, so dropping the `createTask` call
  // does nothing for an install that already ran it: the task stays in this
  // service's record and keeps rendering in the Dependencies section forever.
  // Removing a task means clearing it by replay id, which is
  // `${packageId}:${actionId}`.
  //
  // Kept in the init path rather than in a migration on purpose. A migration
  // fires only for installs crossing one particular version boundary, and this
  // needs to repair any install that has ever held the task. Clearing an id
  // that is not there is a no-op.
  await sdk.action.clearTask(effects, 'knots-prerdts:get-address')

  // NOTHING RECOMMENDS THE NODE'S ADDRESS ANY MORE, AND NOTHING SHOULD.
  //
  // This used to raise the node's Get Address action as an `important` task, so
  // the Dependencies section told you to fetch a payout address from the node.
  // That is a habit inherited from this package's regtest ancestor, where the
  // node's wallet was the only wallet in play and the coins were worthless.
  //
  // On mainnet it is advice that costs money. A payout address should be one
  // whose keys you hold in a wallet you back up, which for most people is an
  // external wallet such as Sparrow, not the node's own wallet sitting on the
  // server. A block found solo pays its whole subsidy to that single address.
  //
  // The node's Get Address action still exists and still works for anyone who
  // wants it. This package simply no longer points at it.

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
