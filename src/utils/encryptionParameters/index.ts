import { getPublicKey, getMnemonicPhrase, getSeedFromMnemonic } from '@/utils/cipher'
import { EncryptionParameters } from '@/types/encryptionParameters'

export const getEncryptionParameters = async (wordList?: string[]): Promise<EncryptionParameters> => {
  let mnemonicPhrase: string[]
  if (wordList) {
    mnemonicPhrase = wordList
  } else {
    mnemonicPhrase = getMnemonicPhrase()
  }

  const seed = await getSeedFromMnemonic(mnemonicPhrase)
  const publicKey = getPublicKey(seed)

  return {
    wordList: mnemonicPhrase,
    seed,
    publicKey
  }
}
