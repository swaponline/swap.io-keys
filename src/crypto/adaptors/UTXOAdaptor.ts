/* eslint-disable */
import BaseAdaptor from './BaseAdaptor'
import BaseWallet from '../wallets/BaseWallet'
import UTXOWallet from '../wallets/UTXOWallet'
import { ISignedMessage } from '../types'

type Seed = Buffer

class UTXOAdaptor extends BaseAdaptor {
  private network: unknown = false // For utxo like

  constructor(networkConfig) {
    super(networkConfig)
    this.network = networkConfig.network
  }

  public getUTXOConfig() {
    return this.network
  }

  public createWallet(options): BaseWallet|false{
    const wallet = new UTXOWallet({
      networkAdaptor: this,
      ...options
    })
    return wallet
  }

  public signMessage(options = {}): ISignedMessage|false {
    return false
  }

  public validateMessage(signedMessage: ISignedMessage): Boolean {
    return false
  }
}


export default UTXOAdaptor