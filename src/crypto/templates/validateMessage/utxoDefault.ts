import * as bitcoinMessage from 'bitcoinjs-message'
import { ISignedMessage } from '../../types'

export const validateMessage = (signedMessage: ISignedMessage) => {
  const {
    message,
    sign,
    address
  } = signedMessage

  const isValid = bitcoinMessage.verify(message, address, sign)
  return isValid
}