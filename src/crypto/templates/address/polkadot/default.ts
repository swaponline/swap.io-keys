/* eslint-disable */
import * as edHd from 'ed25519-hd-key'
import Keyring from '@polkadot/keyring'
import * as bip39 from 'bip39'


const generateAddress = (options) => {
  const {
    networkAdaptor,
    walletIndex,
    seed,
  } = options

  console.log('>>>> seed')
  console.log(seed)
  const mnemonic = bip39.entropyToMnemonic(Buffer.from(seed).toString('hex'))

  const derivePath = `m/${networkAdaptor.bip44.purpose}'/${networkAdaptor.bip44.cointype}'/${walletIndex}'`
  const data = edHd.derivePath(derivePath, seed)
  const polkaRing = new Keyring({ type: 'ed25519' })

  const pair = polkaRing.addFromSeed(data.key)

  return {
    privateKey: '',
    publicKey: pair.publicKey,
    address: pair.address
  }
}



export default generateAddress