/* eslint-disable */
import BaseWallet from './BaseWallet'
import { hdkey } from 'ethereumjs-wallet'
import templatesAddress from '../templatesAddress'


class SUBSTRADEWallet extends BaseWallet {
  constructor(networkAdaptor, seed, walletIndex: number, options = {}) {
    super(networkAdaptor, seed, walletIndex)

    const hdwallet = hdkey.fromMasterSeed(seed)
    const derivePath = `m/${networkAdaptor.bip44.purpose}'/${networkAdaptor.bip44.cointype}'/0'/0/${walletIndex}`

    const wallet = hdwallet.derivePath(derivePath).getWallet()

    if (templatesAddress[`${networkAdaptor.getSymbol()}/default`] !== undefined) {
      const walletData = templatesAddress[`${networkAdaptor.getSymbol()}/default`]({
        ...options,
        networkAdaptor,
        seed,
        walletIndex,
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