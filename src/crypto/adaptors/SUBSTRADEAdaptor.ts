/* eslint-disable */
import BaseAdaptor from './BaseAdaptor'
import BaseWallet from '../wallets/BaseWallet'
import SUBSTRADEWallet from '../wallets/SUBSTRADEWallet'

type Seed = Buffer

class SUBSTRADEAdaptor extends BaseAdaptor {
  constructor(networkConfig) {
    super(networkConfig)
  }

  public createWallet(seed: Seed, index: number): BaseWallet|false{
    const wallet = new SUBSTRADEWallet(this, seed, index)
    return wallet
  }
}


export default SUBSTRADEAdaptor