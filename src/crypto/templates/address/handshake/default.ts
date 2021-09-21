/* eslint-disable */
import handshake from 'handshake-util'
import bitcore from 'bitcore-lib'

const generateAddress = (options) => {
  const { child } = options

  const privateKey = new bitcore.PrivateKey.fromWIF(child.toWIF(), options.network)
  const publicKey = bitcore.PublicKey(privateKey, options.network)
  const ring = handshake.KeyRing.fromPublic(publicKey.toBuffer())

  const address = ring.getAddress().toString()

  return {
    privateKey: child.toWIF(),
    publicKey: publicKey.toString(),
    address,
  }
}



export default generateAddress