/* eslint-disable */
import BaseAdaptor from './BaseAdaptor'
import BaseWallet from '../wallets/BaseWallet'
import SUBSTRADEWallet from '../wallets/SUBSTRADEWallet'

type Seed = Buffer

class SUBSTRADEAdaptor extends BaseAdaptor {
  constructor(networkConfig) {
    super(networkConfig)
  }

  public createWallet(options): BaseWallet|false{
    const wallet = new SUBSTRADEWallet({
      networkAdaptor: this,
      ...options
    })
    return wallet
  }
}


export default SUBSTRADEAdaptor