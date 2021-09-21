import { hdkey } from 'ethereumjs-wallet'
import * as bip39 from 'bip39'
import web3utils from 'web3-utils'

import bip44 from '../bip44'
import { ICoin, ENetworkType } from '../types'

const ETH: ICoin = {
  symbol: 'ETH',
  name: 'Ethereum',
  precision: 18,
  networks: {
    mainnet: {
      type: ENetworkType.Mainnet,
      settings: {
        port: 0, // todo: remove
        magic: 0, // todo: remove
        messagePrefix: '', // todo: remove
        base58prefix: {
          // todo: remove
          pubKeyHash: 0, // todo: remove
          scriptHash: 0, // todo: remove
          privateKeyWIF: 0, // todo: remove
          publicKeyBIP32: 0, // todo: remove
          privateKeyBIP32: 0 // todo: remove
        },
        bip44: {
          coinIndex: 60
        }
      }
    }
  },
  profileFromMnemonic({ mnemonic, addressIndex }) {
    const masterSeed = bip39.mnemonicToSeedSync(mnemonic)
    const hdwallet = hdkey.fromMasterSeed(masterSeed)

    const derivePath = bip44.createDerivePath({
      coinIndex: 60,
      addressIndex
    })

    const wallet = hdwallet.derivePath(derivePath).getWallet()
    const privateKey = wallet.getPrivateKeyString()
    const publicKey = wallet.getPublicKeyString()
    /*
    publicKey: x-coordinate (32 bytes) + y-coordinate (32 bytes)
    publicKeyCompressed: (y-coordinate is even ? 0x02 : 0x03) + x-coordiate (32 bytes)
    */
    const x = publicKey.slice(2, 2 + 32 * 2) // 1 byte = 2 symbols
    const yLastByte = +`0x${publicKey.slice(-2)}`
    const yIsEven = yLastByte % 2 === 0
    const publicKeyCompressed = `0x${yIsEven ? '02' : '03'}${x}`

    const address = wallet.getAddressString()

    const account = {
      privateKey,
      publicKey: publicKeyCompressed,
      address: web3utils.toChecksumAddress(address)
    }

    return account
  }
}

export default ETH
