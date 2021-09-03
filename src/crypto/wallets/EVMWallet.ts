/* eslint-disable */
import BaseWallet from './BaseWallet'
import { hdkey } from 'ethereumjs-wallet'
import templatesAddress from '../templatesAddress'


class EVMWallet extends BaseWallet {
  constructor(networkAdaptor, seed, walletIndex: number, options = {}) {
    super(networkAdaptor, seed, walletIndex)

    const derivePath = `m/${networkAdaptor.bip44.purpose}'/${networkAdaptor.bip44.cointype}'/0'/0/${walletIndex}`

    if (templatesAddress[`${networkAdaptor.getSymbol()}/default`] !== undefined) {
      const walletData = templatesAddress[`${networkAdaptor.getSymbol()}/default`]({
        ...options,
        networkAdaptor,
        seed,
        walletIndex,
        derivePath,
      })
      this.address = walletData.address
      this.privateKey = walletData.privateKey
      this.publicKey = walletData.publicKey
    } else {
      const hdwallet = hdkey.fromMasterSeed(seed)
      const wallet = hdwallet.derivePath(derivePath).getWallet()

      this.address = `0x${wallet.getAddress().toString('hex')}`
      this.privateKey = `0x${wallet.getPrivateKey().toString('hex')}`
      this.publicKey = `0x${wallet.getPublicKey().toString('hex')}`
    }
  }
}

export default EVMWallet