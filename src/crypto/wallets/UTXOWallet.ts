/* eslint-disable */
import BaseWallet from './BaseWallet'
import * as bip32 from 'bip32'
import bitcore from 'bitcore-lib'

import bip44 from '../bip44'

import templatesAddress from '../templatesAddress'


class UTXOWallet extends BaseWallet {
  constructor(networkAdaptor, seed, walletIndex: number, options = {}) {
    super(networkAdaptor, seed, walletIndex)

    const utxoNetwork = networkAdaptor.getUTXOConfig()

    const seedSettings = {
      wif: utxoNetwork.settings.base58prefix.privateKeyWIF,
      bip32: {
        public: utxoNetwork.settings.base58prefix.publicKeyBIP32,
        private: utxoNetwork.settings.base58prefix.privateKeyBIP32
      },
      messagePrefix: utxoNetwork.settings.messagePrefix,
      pubKeyHash: utxoNetwork.settings.base58prefix.pubKeyHash,
      scriptHash: utxoNetwork.settings.base58prefix.scriptHash
    }

    const root = bip32.fromSeed(seed, seedSettings)
    const networks = bitcore.Networks
    const ourNetwork = {
      name: `${networkAdaptor.getSymbol()}-network`,
      alias: `${networkAdaptor.getSymbol()}-network`,
      pubkeyhash: utxoNetwork.settings.base58prefix.pubKeyHash,
      privatekey: utxoNetwork.settings.base58prefix.privateKeyWIF,
      scripthash: utxoNetwork.settings.base58prefix.scriptHash,
      xpubkey: utxoNetwork.settings.base58prefix.pubKeyHash,
      xprivkey: utxoNetwork.settings.base58prefix.privateKeyBIP32,
      networkMagic: utxoNetwork.settings.magic,
      port: 7078,
      dnsSeeds: []
    }
    networks.add(ourNetwork)

    const bitcoreNetwork = networks.get(`${networkAdaptor.getSymbol()}-network`, 'name')

    const bitcoinNetwork = networks.get('livenet', 'name')
    // need remove because of bitcore.PrivateKey() use 'privatekey' key to get network
    // for validation and bitcoin.livenet.privatekey === nextNetwork.privatekey
    networks.remove(bitcoinNetwork)

    const derivePath = `m/${networkAdaptor.bip44.purpose}'/${networkAdaptor.bip44.cointype}'/0'/0/${walletIndex}`
console.log('>>> derivePath', derivePath)
    const child = root.derivePath(derivePath)

    if (templatesAddress[`${networkAdaptor.getSymbol()}/default`] !== undefined) {
      const walletData = templatesAddress[`${networkAdaptor.getSymbol()}/default`]({
        ...options,
        network: bitcoreNetwork,
        derivePath,
        seed,
        child,
        networkAdaptor,
        walletIndex
      })
      this.address = walletData.address
      this.privateKey = walletData.privateKey
      this.publicKey = walletData.publicKey
    } else {
      // eslint-disable-next-line new-cap

      const privateKey = new bitcore.PrivateKey.fromWIF(child.toWIF(),bitcoreNetwork)
      const publicKey = bitcore.PublicKey(privateKey, bitcoreNetwork)
      const address = new bitcore.Address(publicKey, bitcoreNetwork)

      this.address = address.toString()
      this.privateKey = child.toWIF()
      this.publicKey = publicKey.toString()
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


export default UTXOWallet