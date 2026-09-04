// Only en_US is authored here. The other locales carry the same English text
// rather than a machine translation, so a translator can see what still needs
// doing instead of finding plausible-looking text that nobody checked.
const shortEn =
  'Mine the SHA256 chain with your own block templates, on a node that never enforces BIP-110'

const longEn =
  "DATUM Gateway builds block templates on your own node and hands them to your miner as Stratum work, so you choose what goes in the blocks you mine rather than taking a pool's template. This one runs against Bitcoin Knots (SHA256) Companion, and that pairing is the point: the companion never enforces BIP-110, so if the network splits over that rule, the blocks this gateway builds follow the side that does not require it. Solo or pooled, both work. Leave the DATUM Pool settings empty and a block you find pays its whole subsidy to the address you configure. Fill them in and you mine to a pool while still building your own templates, which is what DATUM is for. SET A PAYOUT ADDRESS BEFORE YOU MINE. There is no default, because a default would mean sending your block rewards to somebody else, and the service will not start until you set one. It installs alongside the official Datum Gateway without disturbing it, on its own ports, so you can run one gateway against your primary node and this one against the companion."

export const short = {
  en_US: shortEn,
  es_ES: shortEn,
  de_DE: shortEn,
  pl_PL: shortEn,
  fr_FR: shortEn,
}

export const long = {
  en_US: longEn,
  es_ES: longEn,
  de_DE: longEn,
  pl_PL: longEn,
  fr_FR: longEn,
}
