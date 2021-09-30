/* eslint-disable */
import BaseAdaptor from './BaseAdaptor'
import BaseWallet from '../wallets/BaseWallet'
import UTXOWallet from '../wallets/UTXOWallet'
import { ISignedMessage } from '../types'

import { signMessage as utxoSignMessage } from '../templates/signMessage/utxoDefault'
import { validateMessage as utxoValidateMessage } from '../templates/validateMessage/utxoDefault'

type Seed = Buffer

class UTXOAdaptor extends BaseAdaptor {
  private network: any = false // For utxo like

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

  public signMessage(options): ISignedMessage|false {
    return utxoSignMessage({
      ...options,
      adaptor: this,
    })
  }

  public validateMessage(signedMessage: ISignedMessage): Boolean {
    return utxoValidateMessage(signedMessage)
  }
}


export default UTXOAdaptor