/* eslint-disable */
import BaseAdaptor from './BaseAdaptor'
import BaseWallet from '../wallets/BaseWallet'
import EVMWallet from '../wallets/EVMWallet'

type Seed = Buffer

class EVMAdaptor extends BaseAdaptor {
  constructor(networkConfig) {
    super(networkConfig)
  }

  public createWallet(options): BaseWallet|false{
    const wallet = new EVMWallet({
      networkAdaptor: this,
      ...options
    })
    return wallet
  }
}


export default EVMAdaptor