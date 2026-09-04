// Why this gateway needs that specific node, shown in the dependency prompt.
const en =
  'Provides the block templates this gateway turns into work for your miner. ' +
  'It must be the SHA256 companion rather than your primary node: StartOS ' +
  'resolves a dependency by package id, and this pairs with the companion. The ' +
  'companion is also the node that never enforces BIP-110, so if the network ' +
  'splits over that rule, the blocks this gateway builds follow the side that ' +
  'does not require it.'

export const knotsDependencyDescription = {
  en_US: en,
  es_ES: en,
  de_DE: en,
  pl_PL: en,
  fr_FR: en,
}
