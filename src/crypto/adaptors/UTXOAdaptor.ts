/* eslint-disable */
import BaseAdaptor from './BaseAdaptor'
import BaseWallet from '../wallets/BaseWallet'
import UTXOWallet from '../wallets/UTXOWallet'

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
}


export default UTXOAdaptor