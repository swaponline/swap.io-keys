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

  public createWallet(seed: Seed, index: number): BaseWallet|false{
    const wallet = new UTXOWallet(this, seed, index)
    return wallet
  }
}


export default UTXOAdaptor