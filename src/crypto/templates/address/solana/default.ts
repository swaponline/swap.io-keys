/* eslint-disable */
// https://github.com/project-serum/spl-token-wallet/blob/3266b339c450cb5b2fd938e534a6eef55a3241e3/src/utils/walletProvider/localStorage.js#L15
import * as solanaWeb3 from '@solana/web3.js'
import { Account } from '@solana/web3.js'
import { derivePath as derivePathFunc } from 'ed25519-hd-key'
import nacl from 'tweetnacl'

const  generateAddress = (options) => {

  const bip44 = options.networkAdaptor.bip44
  const path = `m/${bip44.purpose}'/${bip44.cointype}'/${options.walletIndex}'`

  const workKeySeed = derivePathFunc(path, options.seed).key

  const account = new Account(nacl.sign.keyPair.fromSeed(workKeySeed).secretKey)

  const publicKey = account.publicKey
  const privateKey = account.secretKey

  return {
    privateKey: privateKey.toString('hex'),
    publicKey: publicKey.toString(),
    address: publicKey.toString(),
  }
}



export default generateAddress