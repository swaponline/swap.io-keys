import { UserColorScheme } from '@/utils/generators/background'
import { getEncryptionParameters } from '@/utils/encryptionParameters'
import { EncryptionParameters } from '@/types/encryptionParameters'
import { UserTheme } from '@/types/userTheme'
import { ColorScheme } from '@/types/generators'

export async function getUserTheme(wordList?: string[]): Promise<UserTheme> {
  let encryptionParameters: EncryptionParameters

  if (wordList) {
    encryptionParameters = await getEncryptionParameters(wordList)
  } else {
    encryptionParameters = await getEncryptionParameters()
  }
  const { publicKey } = encryptionParameters

  if (!publicKey) throw new Error('the key was not received')

  const colorScheme: ColorScheme = new UserColorScheme(publicKey).getColorScheme()

  return {
    colorScheme,
    ...encryptionParameters
  }
}
