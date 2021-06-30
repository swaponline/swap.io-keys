import { ColorScheme } from '@/types/generators'
import { EncryptionParameters } from '@/types/encryptionParameters'

export interface UserTheme extends EncryptionParameters {
  colorScheme: ColorScheme
}
