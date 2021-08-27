/* eslint-disable */
import bitcoin from 'bitcoinjs-lib'
import ethUtil from 'ethereumjs-util'
import bitcore from 'bitcore-lib'

const generateAddress = (options) => {
  const { child } = options
  const privateKey = new bitcore.PrivateKey.fromWIF(child.toWIF(), options.network)
  const publicKey = bitcore.PublicKey(privateKey, options.network)

  const pubkeyBuffer = publicKey.toBuffer()
  const ethPubkey = ethUtil.importPublic(pubkeyBuffer)
  const addressBuffer = ethUtil.publicToAddress(ethPubkey)
  const address = bitcoin.address.toBase58Check(addressBuffer, 0x41)

  return {
    privateKey: privateKey.toWIF(),
    publicKey: pubkeyBuffer.toString(),
    address,
  }
}



export default generateAddress