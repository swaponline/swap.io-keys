/* eslint-disable */

import BaseWallet from './wallets/BaseWallet'
import BaseAdaptor from './adaptors/BaseAdaptor'
import { getStorage, setStorage } from '@/utils/storage'
import { encryptData, decryptData } from '@/utils/cipher'

type Seed = Buffer
class CryptoProfile {
  private wallets: Array<BaseWallet> = []
  private seed: Seed
  private mnemonic: string

  constructor(seed: Seed, mnemonic: string) {
    this.seed = seed
    this.mnemonic = mnemonic
    console.log('>>>> profile seed', seed)
    console.log(Buffer.from(seed).toString('hex'))
  }

  public getWallets(): Array<BaseWallet> {
    return this.wallets
  }

  public createWallet(networkAdaptor: BaseAdaptor, walletNumber: number): BaseWallet| false {
    const wallet = networkAdaptor.createWallet(this.seed, walletNumber)
    return wallet
  }


}


export default CryptoProfile