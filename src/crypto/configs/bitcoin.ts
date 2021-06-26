const network = {
  type: `utxo`,
  name: `Bitcoin network`,
  fee_max: 1000000,
  fee_min: 1024,
  dust_amount: 1000,
  priority: 1,
  coin: {
    symbol: `BTC`,
    slug: `bitcoin`,
    name: `bitcoin`,
    name_plural: `bitcoins`,
    denominator: 1e-8
  },
  rpc: [
    {
      protocol: 'http',
      user: 'user',
      pass: 'pass',
      host: '127.0.0.1',
      port: '18332'
    }
  ],
  bip44: {
    purpose: `44'`,
    cointype: `0'`
  },
  prefix: {
    message: `\u0018Bitcoin Signed Message:\n`,
    p2pkh: `00`,
    p2sh: `05`,
    bech32: `bc`,
    wif: `80`
  }
}

export default network
