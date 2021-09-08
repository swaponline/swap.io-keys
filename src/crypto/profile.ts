/* eslint-disable */

import BaseWallet from './wallets/BaseWallet'
import BaseAdaptor from './adaptors/BaseAdaptor'
import { getStorage, setStorage } from '@/utils/storage'
import { encryptData, decryptData } from '@/utils/cipher'

type Seed = Buffer
interface ICryptoProfileOptions {
  seed: Seed
  mnemonic: string
  password: string
}
class CryptoProfile {
  private wallets: Array<BaseWallet> = []
  private seed: Seed
  private mnemonic: string
  private password: string

  constructor(options: ICryptoProfileOptions) {
    const {
      seed,
      mnemonic,
      password,
    } = options

    this.seed = seed
    this.mnemonic = mnemonic
    this.password = password
    console.log('>>>> profile seed', seed)
    console.log(Buffer.from(seed).toString('hex'))
  }

  public getWallets(): Array<BaseWallet> {
    return this.wallets
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


}


export default CryptoProfile