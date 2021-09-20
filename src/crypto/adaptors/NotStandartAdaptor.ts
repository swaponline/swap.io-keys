/* eslint-disable */
import BaseAdaptor from './BaseAdaptor'
import BaseWallet from '../wallets/BaseWallet'
import NotStandartWallet from '../wallets/NotStandartWallet'

class NotStandartAdaptor extends BaseAdaptor {
  constructor(networkConfig) {
    super(networkConfig)
  }

  public createWallet(options): BaseWallet|false{
    const wallet = new NotStandartWallet({
      networkAdaptor: this,
      ...options
    })
    return wallet
  }
}


export default NotStandartAdaptor