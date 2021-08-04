/* eslint-disable */
import BaseWallet from './BaseWallet'
import * as bip32 from 'bip32'
import bitcore from 'bitcore-lib'

import bip44 from '../bip44'

class UTXOWallet extends BaseWallet {
  constructor(networkAdaptor, seed, walletIndex: number) {
    super(networkAdaptor, seed, walletIndex)

    const utxoNetwork = networkAdaptor.getUTXOConfig()

    const root = bip32.fromSeed(seed, {
      wif: utxoNetwork.settings.base58prefix.privateKeyWIF,
      bip32: {
        public: utxoNetwork.settings.base58prefix.publicKeyBIP32,
        private: utxoNetwork.settings.base58prefix.privateKeyBIP32
      },
      messagePrefix: utxoNetwork.settings.messagePrefix,
      pubKeyHash: utxoNetwork.settings.base58prefix.pubKeyHash,
      scriptHash: utxoNetwork.settings.base58prefix.scriptHash
    })

    const derivePath = `m/${networkAdaptor.bip44.purpose}'/${networkAdaptor.bip44.cointype}'/0'/0/${walletIndex}`

    const child = root.derivePath(derivePath)

    // eslint-disable-next-line new-cap
    const privateKey = new bitcore.PrivateKey.fromWIF(child.toWIF())
    const publicKey = bitcore.PublicKey(privateKey, utxoNetwork.name)
    const address = new bitcore.Address(publicKey, utxoNetwork.name)

    this.address = address.toString()
    this.privateKey = child.toWIF()
    this.publicKey = publicKey.toString()
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


export default UTXOWallet