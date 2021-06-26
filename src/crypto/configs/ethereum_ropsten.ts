const network = {
  isEvm: true,
  name: `Ethereum network (Ropsten)`,
  priority: 3,
  chainId: 0x3,
  coin: {
    symbol: `ETH`,
    slug: `ether`,
    name: `ether`,
    name_plural: `ether`,
    denominator: 1e-18
  },
  rpc: ['https://ropsten.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c'],
  bip32: {
    purpose: `44'`,
    cointype: `60'`
  },
  prefix: {
    message: '\u0019Ethereum Signed Message:\n',
    p2pkh: '00',
    wif: '80'
  }
}

export default network
