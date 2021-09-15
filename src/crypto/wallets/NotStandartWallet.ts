/* eslint-disable */
import BaseWallet from './BaseWallet'
import templatesAddress from '../templatesAddress'


class NotStandartWallet extends BaseWallet {
  constructor(options) {
    super(options)
    const networkAdaptor = this.networkAdaptor
    const seed = this.seed
    const walletIndex = this.walletIndex

    const derivePath = `m/${networkAdaptor.bip44.purpose}'/${networkAdaptor.bip44.cointype}'/0'/0/${walletIndex}`

    if (templatesAddress[`${networkAdaptor.getSymbol()}/default`] !== undefined) {
      const walletData = templatesAddress[`${networkAdaptor.getSymbol()}/default`]({
        ...options,
        derivePath,
      })
      this.address = walletData.address
      this.privateKey = walletData.privateKey
      this.publicKey = walletData.publicKey
    } else {
      throw new Error(`Not standart wallet - need template for wallet generator`)
    }
  }
/*
  public signMessage(message: string): string {
    return message
  }

  public signTransaction(transaction: any): any {
    return transaction
  }

  public send(options: ISendOptions): Promise<string>|false { return false }
  */
}


export default NotStandartWallet