import * as EthUtil from 'ethereumjs-util'

export const signMessage = (options) => {
  const {
    message,
    adaptor,
  } = options
  //@ts-ignore
  const signWallet: BaseWallet = adaptor.createWallet(options)

  const signWalletPrvKey = signWallet.getPrivateKey()

  const privateKey = EthUtil.toBuffer(signWalletPrvKey)
  const hashedMessage = EthUtil.keccak(Buffer.from(message, 'utf8'))
  const signature = EthUtil.ecsign(hashedMessage, privateKey)

  const compactSig = EthUtil.toRpcSig(
    signature.v,
    signature.r,
    signature.s
  )

  return {
    message,
    pubkey: signWallet.getPublicKey(),
    address: signWallet.getAddress(),
    sign: compactSig,
    network: adaptor.getSymbol()
  }
}