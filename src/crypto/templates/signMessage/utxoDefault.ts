import * as bitcoin from 'bitcoinjs-lib'
import * as bitcoinMessage from 'bitcoinjs-message'

export const signMessage = (options) => {
  const {
    message,
    adaptor
  } = options
  //@ts-ignore
  const signWallet: BaseWallet = adaptor.createWallet(options)

  const netinfo = adaptor.network.settings
  const signParams = {
    messagePrefix: netinfo.messagePrefix,
    bip32: {
      public: netinfo.base58prefix.publicKeyBIP32,
      private: netinfo.base58prefix.privateKeyBIP32,
    },
    pubKeyHash: netinfo.base58prefix.pubKeyHash,
    scriptHash: netinfo.base58prefix.scriptHash,
    wif: netinfo.base58prefix.privateKeyWIF
  }

  // @ts-ignore
  const keyPair = bitcoin.ECPair.fromWIF(signWallet.privateKey, signParams)
  // @ts-ignore
  const signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed)

  return {
    message,
    pubkey: signWallet.getPublicKey(),
    address: signWallet.getAddress(),
    sign: signature.toString('base64'),
    network: adaptor.getSymbol()
  }
}