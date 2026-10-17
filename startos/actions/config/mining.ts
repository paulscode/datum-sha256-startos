import { CONFIG_GROUP, i18n, readGroup, sdk, writeGroup } from './_shared'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  coinbase_tag_primary: Value.text({
    name: i18n('Primary Coinbase Tag'),
    description: i18n(
      'Free text placed in the coinbase of blocks this gateway builds, when mining solo. Leave blank for “DATUM Gateway”. A pool overrides this.',
    ),
    required: false,
    default: null,
    placeholder: 'DATUM Gateway',
  }),
  coinbase_tag_secondary: Value.text({
    name: i18n('Secondary Coinbase Tag'),
    description: i18n(
      'Free text placed in the coinbase of blocks this gateway builds. Yours to label blocks with.',
    ),
    required: false,
    default: null,
    placeholder: 'DATUM User',
  }),
  coinbase_unique_id: Value.number({
    name: i18n('Coinbase Unique ID'),
    description: i18n(
      'A number from 1 to 65535, distinguishing two gateways that share the same coinbase tags.',
    ),
    required: false,
    default: null,
    placeholder: '4242',
    min: 1,
    max: 65535,
    integer: true,
  }),
})

/**
 * Two settings the official package's Mining form has are missing here, both
 * because this package already owns them.
 *
 * **The payout address** has its own action, Set Payout Address, which is
 * raised as a critical task on install so a user cannot start mining to
 * nowhere. Duplicating it as a form field would give the same value two
 * editors.
 *
 * **The primary coinbase tag** is editable, and blank means DATUM Gateway's
 * default, "DATUM Gateway". Until 1.0.0:4 its description promised the BLAKE2b
 * sibling's activation headline, which this package never had.
 */
export const miningConfig = sdk.Action.withInput(
  'mining-config',

  async () => ({
    name: i18n('Mining'),
    description: i18n('What goes into the blocks this gateway builds.'),
    warning: null,
    allowedStatuses: 'any',
    group: CONFIG_GROUP,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => readGroup(effects, 'mining'),

  async ({ effects, input }) => writeGroup(effects, 'mining', input),
)
