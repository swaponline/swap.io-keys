/* eslint-disable */
import handshake from 'handshake-util'
import bitcore from 'bitcore-lib'

const generateAddress = (child, options) => {
  console.log('>>>> Call handshake generateAddress')
  const privateKey = new bitcore.PrivateKey.fromWIF(child.toWIF(), options.network)
  const publicKey = bitcore.PublicKey(privateKey, options.network)
  const ring = handshake.KeyRing.fromPublic(publicKey.toBuffer())
  console.log('ring', ring)
  const address = ring.getAddress().toString()
  console.log('>>> address', address)
  return {
    privateKey: child.toWIF(),
    publicKey: publicKey.toString(),
    address,
  }
}



export default generateAddress