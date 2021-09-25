/* eslint-disable */

import BaseWallet from './wallets/BaseWallet'
import BaseAdaptor from './adaptors/BaseAdaptor'
import CryptoInterface from './interface'
import { getStorage, setStorage } from '../utils/storage'
import { encryptData, decryptData } from '../utils/cipher'
import { signMessage as defaultSignMessage } from './templates/signMessage/default'

type Seed = Buffer
interface ICryptoProfileOptions {
  seed: Seed
  mnemonic: string
  password: string
  cInterface: CryptoInterface
}
interface ISignedMessage {
  message: string
  pubkey: string
  sign: string
}

class CryptoProfile {
  private wallets: Array<BaseWallet> = []
  private seed: Seed
  private mnemonic: string
  private password: string
  private cInterface: CryptoInterface

  constructor(options: ICryptoProfileOptions) {
    const {
      seed,
      mnemonic,
      password,
      cInterface
    } = options

    this.seed = seed
    this.mnemonic = mnemonic
    this.password = password
    this.cInterface = cInterface
    console.log('>>>> profile seed', seed)
    console.log(Buffer.from(seed).toString('hex'))
  }

  public getWallets(): Array<BaseWallet> {
    return this.wallets
  }

  public createAddress(networkAdaptor: BaseAdaptor, addressIndex: number, options = {}): BaseWallet| false {
    return this.createWallet(networkAdaptor, addressIndex, options)
  }

  public createWallet(networkAdaptor: BaseAdaptor, walletIndex: number, options = {}): BaseWallet| false {
    const wallet = networkAdaptor.createWallet({
      seed: this.seed,
      mnemonic: this.mnemonic,
      password: this.password,
      walletIndex,
      ...options
    })
    return wallet
  }

  public signMessage(networkAdaptor: BaseAdaptor, message: string): ISignedMessage | boolean {
    /*
    const signWallet = networkAdaptor.createWallet({
      seed: this.seed,
      mnemonic: this.mnemonic,
      password: this.password,
      walletIndex,
      ...options
    })
    */
    /*
        const hash  = this.app.env.web3.utils.soliditySha3(JSON.stringify(message))
    const sign  = this.app.env.web3.eth.accounts.sign(hash, this.app.services.auth.accounts.eth.privateKey)

    return sign
    */
    return false
  }

  public verifyMessage(signedMessage: ISignedMessage): boolean {
    return false
  }
}


export default CryptoProfile