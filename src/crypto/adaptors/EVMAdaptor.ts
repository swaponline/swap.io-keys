/* eslint-disable */
import BaseAdaptor from './BaseAdaptor'
import BaseWallet from '../wallets/BaseWallet'
import EVMWallet from '../wallets/EVMWallet'
import { ISignedMessage } from '../types'
import { signMessage as evmSignMessage } from '../templates/signMessage/evmDefault'
import { validateMessage as evmValidateMessage } from '../templates/validateMessage/evmDefault'
import * as EthUtil from 'ethereumjs-util'

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

  public signMessage(options): ISignedMessage|false {
    return evmSignMessage(options)
  }

  public validateMessage(signedMessage: ISignedMessage): Boolean {
    return evmValidateMessage(signedMessage)
  }
}


export default EVMAdaptor