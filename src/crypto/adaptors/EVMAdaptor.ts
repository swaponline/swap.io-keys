/* eslint-disable */
import BaseAdaptor from './BaseAdaptor'
import BaseWallet from '../wallets/BaseWallet'
import EVMWallet from '../wallets/EVMWallet'
import { ISignedMessage } from '../types'
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
    const {
      message,
    } = options
    //@ts-ignore
    const signWallet: BaseWallet = this.createWallet(options)
    console.log('>>> signWallet', signWallet)
    const signWalletPrvKey = signWallet.getPrivateKey()
    console.log('>>> signWalletPrvKey', signWalletPrvKey)
    const privateKey = EthUtil.toBuffer(signWalletPrvKey)
    const hashedMessage = EthUtil.keccak(Buffer.from(message, 'utf8'))
    const signature = EthUtil.ecsign(hashedMessage, privateKey)
    console.log('>>>. signature', signature)
    console.log(signature.toString())
    return false
  }
}


export default EVMAdaptor