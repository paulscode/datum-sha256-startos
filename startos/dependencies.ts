import { knotsDependencyDescription } from './manifest/i18n-dependency'
import { sdk } from './sdk'

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
const knots = sdk.Dependency.required('knots-prerdts', {
  description: knotsDependencyDescription,
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
  // Our node, never the official `bitcoind`. See the comment at the top.
  //
  // 'running' rather than 'exists': the gateway needs live templates, not just
  // an installed node. This drives the warning UI only; it does not gate
  // startup.
  kind: 'running',
  // Flavored, and it has to be: `knots-prerdts` versions are
  // `#knotsprerdts:29.3:N`, and a flavored version never satisfies an
  // unflavored range. `>=1.0.0` would match nothing at all.
  // :29 is the node release whose btc-rpc-proxy (v0.8.1) re-reads the cookie.
  // Before it the proxy read the cookie once, so after the node's next
  // restart every RPC call from here got 401 for good (upstream a56e874
  // raised its own range for the same reason).
  versionRange: '>=#knotsprerdts:29.3:29',
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
}).withInit(async (effects) => {
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
})

export const dependencies = sdk.Dependencies.of().addDependency(knots)
