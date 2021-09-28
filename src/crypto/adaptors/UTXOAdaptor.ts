/* eslint-disable */
import BaseAdaptor from './BaseAdaptor'
import BaseWallet from '../wallets/BaseWallet'
import UTXOWallet from '../wallets/UTXOWallet'
import { ISignedMessage } from '../types'

import * as bitcoin from 'bitcoinjs-lib'
import * as bitcoinMessage from 'bitcoinjs-message'

type Seed = Buffer

class UTXOAdaptor extends BaseAdaptor {
  private network: unknown = false // For utxo like

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

    ///
    const FLOTESTNET = {
      messagePrefix: '\x19FLO testnet Signed Message:\n',
      bip32: {
        public: 0x013440e2,
        private: 0x01343c23
      },
      pubKeyHash: 0x73,
      scriptHash: 0xc6,
      wif: 0xef
    }
    // @ts-ignore
    var keyPair = bitcoin.ECPair.fromWIF('cRgnQe9MUu1JznntrLaoQpB476M8PURvXVQB5R2eqms5tXnzNsrr', FLOTESTNET)
    // @ts-ignore
    var signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed)

    return false
  }

  public validateMessage(signedMessage: ISignedMessage): Boolean {
    return false
  }
}


export default UTXOAdaptor