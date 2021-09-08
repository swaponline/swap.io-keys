/* eslint-disable */
import BaseWallet from './BaseWallet'
import { hdkey } from 'ethereumjs-wallet'
import templatesAddress from '../templatesAddress'


class SUBSTRADEWallet extends BaseWallet {
  constructor(options) {
    super(options)

    const hdwallet = hdkey.fromMasterSeed(this.seed)
    const derivePath = `m/${this.networkAdaptor.bip44.purpose}'/${this.networkAdaptor.bip44.cointype}'/0'/0/${this.walletIndex}`

    const wallet = hdwallet.derivePath(derivePath).getWallet()

    if (templatesAddress[`${this.networkAdaptor.getSymbol()}/default`] !== undefined) {
      const walletData = templatesAddress[`${this.networkAdaptor.getSymbol()}/default`]({
        ...options,
      })
      this.address = walletData.address
      this.privateKey = walletData.privateKey
      this.publicKey = walletData.publicKey
    } else {
      this.address = `0x${wallet.getAddress().toString('hex')}`
      this.privateKey = `0x${wallet.getPrivateKey().toString('hex')}`
      this.publicKey = `0x${wallet.getPublicKey().toString('hex')}`
    }
  }
}

export default SUBSTRADEWallet