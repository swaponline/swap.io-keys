/* eslint-disable */
import BaseWallet from './BaseWallet'
import { hdkey } from 'ethereumjs-wallet'
import templatesAddress from '../templatesAddress'


class EVMWallet extends BaseWallet {
  constructor(options) {
    super(options)

    const derivePath = `m/${this.networkAdaptor.bip44.purpose}'/${this.networkAdaptor.bip44.cointype}'/0'/0/${this.walletIndex}`

    if (templatesAddress[`${this.networkAdaptor.getSymbol()}/default`] !== undefined) {
      const walletData = templatesAddress[`${this.networkAdaptor.getSymbol()}/default`]({
        ...options,
        derivePath,
      })
      this.address = walletData.address
      this.privateKey = walletData.privateKey
      this.publicKey = walletData.publicKey
    } else {
      const hdwallet = hdkey.fromMasterSeed(this.seed)
      const wallet = hdwallet.derivePath(derivePath).getWallet()

      this.address = `0x${wallet.getAddress().toString('hex')}`
      this.privateKey = `0x${wallet.getPrivateKey().toString('hex')}`
      this.publicKey = `0x${wallet.getPublicKey().toString('hex')}`
    }
  }
}

export default EVMWallet