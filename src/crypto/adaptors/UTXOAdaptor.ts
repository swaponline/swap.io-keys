/* eslint-disable */
import BaseAdaptor from './BaseAdaptor'
import BaseWallet from '../wallets/BaseWallet'
import UTXOWallet from '../wallets/UTXOWallet'
import { ISignedMessage } from '../types'

import * as bitcoin from 'bitcoinjs-lib'
import * as bitcoinMessage from 'bitcoinjs-message'

type Seed = Buffer

class UTXOAdaptor extends BaseAdaptor {
  private network: any = false // For utxo like

  constructor(networkConfig) {
    super(networkConfig)
    this.network = networkConfig.network
  }

  public getUTXOConfig() {
    return this.network
  }

  public createWallet(options): BaseWallet|false{
    const wallet = new UTXOWallet({
      networkAdaptor: this,
      ...options
    })
    return wallet
  }

  public signMessage(options): ISignedMessage|false {
    const {
      message,
    } = options
    //@ts-ignore
    const signWallet: BaseWallet = this.createWallet(options)

    const netinfo = this.network.settings
    const signParams = {
      messagePrefix: netinfo.messagePrefix,
      bip32: {
        public: netinfo.base58prefix.publicKeyBIP32,
        private: netinfo.base58prefix.privateKeyBIP32,
      },
      pubKeyHash: netinfo.base58prefix.pubKeyHash,
      scriptHash: netinfo.base58prefix.scriptHash,
      wif: netinfo.base58prefix.privateKeyWIF
    }

    // @ts-ignore
    const keyPair = bitcoin.ECPair.fromWIF(signWallet.privateKey, signParams)
    // @ts-ignore
    const signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed)

    return {
      message,
      pubkey: signWallet.getPublicKey(),
      address: signWallet.getAddress(),
      sign: signature.toString('base64'),
      network: this.getSymbol()
    }
  }

  public validateMessage(signedMessage: ISignedMessage): Boolean {
    // Verify a message
    var address = 'oWwrvqa3QP5EHHBiUn9eAQf7d1ts5BnChG'
    var signature = 'ILqvGGBI89K8Tk9/BgrGPSMTB9ZY+Z88Z0GjVsx7uPTwOfQ+eNj/VZKZ40iSbUPgz6mSBvo6w1Dkzns9DqfYa2o='
    var message = 'Hey this is Ranchi Mall'
    console.log(bitcoinMessage.verify(message, address, signature))
    return false
  }
}


export default UTXOAdaptor