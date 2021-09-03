/* eslint-disable */
import * as bip32 from 'bip32'
import * as TronWeb from 'tronweb'


const  generateAddress = (options) => {
  const { seed, derivePath } = options
  const node = bip32.fromSeed(seed)
  const child = node.derivePath(derivePath)
  // @ts-ignore
  const privateKey = child.privateKey.toString('hex')
  const publicKey = child.publicKey.toString('hex')
  const address = TronWeb.address.fromPrivateKey(privateKey)

  return {
    privateKey,
    publicKey,
    address,
  }
}



export default generateAddress