import BaseWallet from './wallets/BaseWallet'
import BaseAdaptor from './adaptors/BaseAdaptor'
import { getStorage, setStorage } from '@/utils/storage'
import { encryptData, decryptData } from '@/utils/cipher'

class CryptoProfile {
  private wallets: Array<BaseWallet> = []


  constructor() {}

  public getWallets(): Array<BaseWallet> {
    return this.wallets
  }

  public createWallet(networkAdaptor: BaseAdaptor): BaseWallet| void {}


}


export default CryptoProfile