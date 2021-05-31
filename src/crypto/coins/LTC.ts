import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import bitcore from 'bitcore-lib'

import bip44 from '../bip44'
import { ICoin, ENetworkType } from '../types'

const netNames = {
  mainnet: 'mainnet',
  testnet: 'testnet'
}

const LTC: ICoin = {
  symbol: 'LTC',
  name: 'Litecoin',
  precision: 8, // ?
  // networkNames: netNames,

  networks: {
    mainnet: {
      type: ENetworkType.Mainnet,
      settings: {
        // from https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/addresses.spec.ts
        // from https://github.com/litecoin-project/litecore-lib/blob/segwit/lib/networks.js
        port: 9333,
        magic: 0xfbc0b6db,
        messagePrefix: '\x19Litecoin Signed Message:\n',
        base58prefix: {
          pubKeyHash: 0x30,
          scriptHash: 0x32,
          privateKeyWIF: 0xb0,
          publicKeyBIP32: 0x019da462,
          privateKeyBIP32: 0x019d9cfe
        },
        bip44: {
          coinIndex: 2
        }
      }
    },

    testnet: {
      type: ENetworkType.Testnet,
      settings: {
        // from https://github.com/trezor/trezor-common/pull/80/files
        // from https://github.com/litecoin-project/litecore-lib/blob/segwit/lib/networks.js
        // from https://github.com/litecoin-project/litecoin/blob/master/src/chainparams.cpp
        port: 19335,
        magic: 0xfdd2c8f1,
        messagePrefix: '\x19Litecoin Signed Message:\n',
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
    const { settings } = LTC.networks[network]

    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const root = bip32.fromSeed(seed /* , network.bip32settings */)
    const derivePath = bip44.createDerivePath({
      coinIndex: settings.bip44.coinIndex,
      addressIndex
    })
    const child = root.derivePath(derivePath)

    let libNetworkName

    if (network === netNames.mainnet) {
      libNetworkName = 'litecoin-mainnet'
    }
    if (network === netNames.testnet) {
      libNetworkName = 'litecoin-testnet'
    }

    if (!libNetworkName) {
      throw new Error(`Unknown network: ${network}`)
    }

    bitcore.Networks.add({
      name: libNetworkName,
      pubkeyhash: settings.base58prefix.pubKeyHash,
      privatekey: settings.base58prefix.privateKeyWIF,
      scripthash: settings.base58prefix.scriptHash,
      xpubkey: settings.base58prefix.publicKeyBIP32,
      xprivkey: settings.base58prefix.privateKeyBIP32,
      networkMagic: settings.magic,
      port: settings.port
    })
    const libNetwork = bitcore.Networks.get(libNetworkName)

    // eslint-disable-next-line new-cap
    const privateKey = new bitcore.PrivateKey.fromWIF(child.toWIF())
    const publicKey = bitcore.PublicKey(privateKey, libNetwork)
    const address = new bitcore.Address(publicKey, libNetwork)

    const account = {
      privateKey,
      publicKey,
      address
    }

    return account
  }
}

export default LTC
