const network = {
  type: `evm`,
  name: `Binance Smart Chain`,
  priority: 2,
  chainId: 0x38,
  coin: {
    symbol: `ETH`,
    slug: `ether`,
    name: `ether`,
    name_plural: `ether`,
    denominator: 1e-18
  },
  rpc: ['https://bsc-dataseed.binance.org/'],
  bip44: {
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
