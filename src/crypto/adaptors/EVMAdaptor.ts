/* eslint-disable */
import BaseAdaptor from './BaseAdaptor'
import BaseWallet from '../wallets/BaseWallet'
import EVMWallet from '../wallets/EVMWallet'

type Seed = Buffer

class EVMAdaptor extends BaseAdaptor {
  constructor(networkConfig) {
    super(networkConfig)
  }

  public createWallet(seed: Seed, index: number): BaseWallet|false{
    const wallet = new EVMWallet(this, seed, index)
    return wallet
  }
}


export default EVMAdaptor