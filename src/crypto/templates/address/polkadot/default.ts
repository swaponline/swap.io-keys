/* eslint-disable */
import * as edHd from 'ed25519-hd-key'
import Keyring from '@polkadot/keyring'
import * as bip39 from 'bip39'


const generateAddress = (options) => {
  const {
    networkAdaptor,
    walletIndex,
    seed,
    mnemonic,
  } = options

  const polkaRing = new Keyring({ type: 'sr25519', ss58Format: 0 })

  const pair = polkaRing.createFromUri(mnemonic)

  return {
    privateKey: '',
    publicKey: pair.publicKey,
    address: pair.address
  }
}



export default generateAddress