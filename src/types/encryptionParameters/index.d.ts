export type PublicKey = Buffer
export type MnemonicPhrase = string[]
export type Seed = Buffer

export interface EncryptionParameters {
  mnemonicPhrase: MnemonicPhrase
  publicKey: PublicKey | null
  seed: Seed | null
}

export interface EncryptionParametersService {
  getMnemonicPhrase: () => MnemonicPhrase
  getPublicKey: (seed: Buffer) => PublicKey
  getSeedFromMnemonic: (mnemonicPhrase: MnemonicPhrase) => Promise<Seed>
}
