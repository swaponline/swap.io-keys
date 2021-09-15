/* eslint-disable */
import StellarBase from 'stellar-base'
import * as edHd from 'ed25519-hd-key'

const generateAddress = (options) => {
  const {
    networkAdaptor,
    walletIndex,
    seed,
  } = options

  const derivePath = `m/${networkAdaptor.bip44.purpose}'/${networkAdaptor.bip44.cointype}'/${walletIndex}'`

  const data = edHd.derivePath(derivePath, seed)
  const keyPair = StellarBase.Keypair.fromRawEd25519Seed(data.key)

  const privkey = keyPair.secret()
  const pubkey = keyPair.publicKey()
  const address = pubkey

  return {
    privateKey: privkey,
    publicKey: pubkey,
    address,
  }
}



export default generateAddress