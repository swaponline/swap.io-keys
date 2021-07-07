export interface EncryptionParameters {
  wordList: string[]
  publicKey: Buffer | null
  seed: Buffer | null
}
