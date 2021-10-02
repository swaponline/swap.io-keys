import * as EthUtil from 'ethereumjs-util'
import { ISignedMessage } from '../../types'

export const validateMessage = (signedMessage: ISignedMessage) => {
  const {
    message,
    pubkey,
    address,
    sign
  } = signedMessage
  const hashedMessage = EthUtil.keccak(Buffer.from(message, 'utf8'))
  const ecdsaSignature = EthUtil.fromRpcSig(sign)
  const publicKey = EthUtil.ecrecover(
    hashedMessage,
    ecdsaSignature.v,
    EthUtil.toBuffer(ecdsaSignature.r),
    EthUtil.toBuffer(ecdsaSignature.s)
  ) 
  const recoverdAddress = EthUtil.bufferToHex(EthUtil.pubToAddress(publicKey))
  return (EthUtil.toChecksumAddress(address) == EthUtil.toChecksumAddress(recoverdAddress))
}