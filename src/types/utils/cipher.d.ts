export type CryptoProfile = {
  algo: {
    name: string
    iterations: number
    hash: string
    salt: string
  }
  cipher: {
    name: string
    bits: number
    iv: string
    text: string
  }
  publicKey: string
}
