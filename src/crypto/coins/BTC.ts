import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import bitcore from 'bitcore-lib'

import bip44 from '../bip44'
import { ICoin, ENetworkType } from '../types'

const netNames = {
  mainnet: 'mainnet',
  testnet: 'testnet'
}

const BTC: ICoin = {
  symbol: 'BTC',
  name: 'Bitcoin',
  precision: 8,
  // networkNames: netNames,

  networks: {
    mainnet: {
      type: ENetworkType.Mainnet,
      settings: {
        // from https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/networks.js
        port: 0, // ?
        magic: 0, // ? (aka pchMessageStart)
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        base58prefix: {
          pubKeyHash: 0x00,
          scriptHash: 0x05,
          privateKeyWIF: 0x80,
          publicKeyBIP32: 0x0488b21e,
          privateKeyBIP32: 0x0488ade4
        },
        bip44: {
          coinIndex: 0
        }
      }
    },

    testnet: {
      type: ENetworkType.Testnet,
      settings: {
        // from https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/networks.js
        port: 0, // ?
        magic: 0, // ?
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        base58prefix: {
          pubKeyHash: 0x6f,
          scriptHash: 0xc4,
          privateKeyWIF: 0xef,
          publicKeyBIP32: 0x043587cf,
          privateKeyBIP32: 0x04358394
        },
        bip44: {
          coinIndex: 1
        }
      }
    }
  },
  profileFromMnemonic({ mnemonic, network, addressIndex }) {
    const { settings } = BTC.networks[network]

    // todo: move?
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const root = bip32.fromSeed(seed, {
      wif: settings.base58prefix.privateKeyWIF,
      bip32: {
        public: settings.base58prefix.publicKeyBIP32,
        private: settings.base58prefix.privateKeyBIP32
      },
      messagePrefix: settings.messagePrefix,
      pubKeyHash: settings.base58prefix.pubKeyHash,
      scriptHash: settings.base58prefix.scriptHash
    })
    const derivePath = bip44.createDerivePath({
      coinIndex: settings.bip44.coinIndex,
      addressIndex
    })
    const child = root.derivePath(derivePath)

    let libNetwork

    if (network === netNames.mainnet) {
      libNetwork = bitcore.Networks.mainnet
    }

    if (network === netNames.testnet) {
      libNetwork = bitcore.Networks.testnet
    }

    if (!libNetwork) {
      throw new Error(`Unknown network: ${network}`)
    }

    // eslint-disable-next-line new-cap
    const privateKey = new bitcore.PrivateKey.fromWIF(child.toWIF())
    const publicKey = bitcore.PublicKey(privateKey, libNetwork)
    const address = new bitcore.Address(publicKey, libNetwork)

    const account = {
      privateKey: child.toWIF(),
      publicKey: publicKey.toString(),
      address: address.toString()
    }

    return account
  }
}

export default BTC
