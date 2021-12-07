export type PublicKey = Buffer
export type MnemonicPhrase = string[]
export type Seed = Buffer

export interface EncryptionParameters {
  mnemonicPhrase: MnemonicPhrase
  publicKey: PublicKey | null
  seed: Seed | null
  password: string
}
