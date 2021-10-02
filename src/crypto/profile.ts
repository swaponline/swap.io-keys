/* eslint-disable */

import BaseWallet from './wallets/BaseWallet'
import BaseAdaptor from './adaptors/BaseAdaptor'
import CryptoInterface from './interface'
import { getStorage, setStorage } from '../utils/storage'
import { encryptData, decryptData } from '../utils/cipher'
import { ISignedMessage } from './types'


type Seed = Buffer
interface ICryptoProfileOptions {
  seed: Seed
  mnemonic: string
  password: string
  cInterface: CryptoInterface
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
    const signedMessage = networkAdaptor.signMessage({
      seed: this.seed,
      mnemonic: this.mnemonic,
      password: this.password,
      walletIndex: 0,
      message
    })
    return signedMessage
  }
}


export default CryptoProfile