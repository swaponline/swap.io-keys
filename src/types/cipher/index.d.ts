export type MnemonicPhrase = string[]
export type PublicKey = Buffer | string
export type Seed = Buffer

export interface DefaultCipherParams {
  algoName: string
  hash: string
  iterations: number
  cipherName: string
  bits: number
}

export interface DefaultDerivationParams {
  typeCurrency: number
  account: number
  change: number
  index: number
}

export interface CryptoProfile {
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
  publicKey: PublicKey
}
