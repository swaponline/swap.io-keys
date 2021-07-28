/* eslint-disable */
import BaseWallet from './BaseWallet'
import { hdkey } from 'ethereumjs-wallet'

class EVMWallet extends BaseWallet {
  constructor(networkAdaptor, seed, walletIndex: number) {
    super(networkAdaptor, seed, walletIndex)

    const hdwallet = hdkey.fromMasterSeed(seed)
    const derivePath = `m/${networkAdaptor.bip44.purpose}'/${networkAdaptor.bip44.cointype}'/0'/0/${walletIndex}`
    console.log('>>>> derivePath', derivePath)
    const wallet = hdwallet.derivePath(derivePath).getWallet()

    this.address = `0x${wallet.getAddress().toString('hex')}`
    this.privateKey = `0x${wallet.getPrivateKey().toString('hex')}`
    this.publicKey = `0x${wallet.getPublicKey().toString('hex')}`
  }
}

export default EVMWallet