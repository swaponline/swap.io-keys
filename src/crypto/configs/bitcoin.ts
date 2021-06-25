const network = {
  name: "Bitcoin network",
  fee_max: 1000000,
  fee_min: 1024,
  dust_amount: 1000,
  priority: 1,
  coin: {
    symbol: "BTC",
    slug: "bitcoin",
    name: "bitcoin",
    name_plural: "bitcoins",
    denominator: 1e-08,
  },
  bip32: {
    bip44: {
      default: true,
      purpose: "44'",
      cointype: "0'"
    },
  },
  prefixes: {
    message: "\u0018Bitcoin Signed Message:\n",
    p2pkh: "00",
    p2sh: "05",
    bech32: "bc",
    wif: "80",
  },
}

export default network