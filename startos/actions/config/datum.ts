import {
  assertTimingsAgree,
  CONFIG_GROUP,
  i18n,
  readGroup,
  sdk,
  writeGroup,
} from './_shared'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  pool_host: Value.text({
    name: i18n('Pool Host'),
    description: i18n('Hostname of a DATUM pool. Leave empty to mine solo.'),
    required: false,
    default: null,
  }),
  pool_port: Value.number({
    name: i18n('Pool Port'),
    description: i18n('Port of that pool.'),
    required: false,
    default: null,
    placeholder: '28915',
    min: 1,
    max: 65535,
    integer: true,
  }),
  pool_pubkey: Value.text({
    name: i18n('Pool Public Key'),
    description: i18n('The pool’s public key, which authenticates it to you.'),
    required: false,
    default: null,
  }),
  pool_pass_workers: Value.toggle({
    name: i18n('Pass Worker Names'),
    description: i18n('Send each miner’s worker name to the pool.'),
    default: false,
  }),
  pool_pass_full_users: Value.toggle({
    name: i18n('Pass Full Usernames'),
    description: i18n('Send the whole username, not just the worker part.'),
    default: true,
  }),
  always_pay_self: Value.toggle({
    name: i18n('Always Pay Self'),
    description: i18n(
      'Pay block rewards to your own address rather than the pool’s.',
    ),
    default: true,
  }),
  pooled_mining_only: Value.toggle({
    name: i18n('Pooled Mining Only'),
    description: i18n(
      'Refuse to serve work when the pool is unreachable, instead of falling back to solo.',
    ),
    warning: i18n(
      'While the pool is unreachable, your miners get no work at all.',
    ),
    default: false,
  }),
  protocol_global_timeout: Value.number({
    name: i18n('Protocol Timeout'),
    description: i18n('Seconds of silence before the pool is treated as gone.'),
    required: false,
    default: null,
    placeholder: '60',
    min: 1,
    integer: true,
    units: 's',
  }),
})

/**
 * Pooled mining works here: this gateway builds SHA256d templates, which is
 * what every DATUM pool validates. Leaving these empty means solo mining.
 *
 * Until 1.0.0:4 this action carried the BLAKE2b sibling's warning that no pool
 * could serve the chain, which was never true of this package.
 */
export const datumConfig = sdk.Action.withInput(
  'datum-config',

  async () => ({
    name: i18n('DATUM Pool'),
    description: i18n('Settings for mining to a DATUM pool.'),
    warning: null,
    allowedStatuses: 'any',
    group: CONFIG_GROUP,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => readGroup(effects, 'datum'),

  async ({ effects, input }) => {
    await assertTimingsAgree(effects, 'datum', input)
    return writeGroup(effects, 'datum', input)
  },
)
