import { userColorSchemeService } from '@/services/userColorScheme'
import { getSeedFromMnemonic, getPublicKey } from '@/utils/cipher'
import {
  mockMnemonicPhrase1,
  mockMnemonicPhrase2,
  mockColorScheme1,
  mockColorScheme2
} from '../../__mocks__/userColorScheme.mock'

describe('User Color Scheme', () => {
  it.each`
    mnemonicPhrase         | colorScheme
    ${mockMnemonicPhrase1} | ${mockColorScheme1}
    ${mockMnemonicPhrase2} | ${mockColorScheme2}
  `('get color Scheme based on mnemonicPhrase ', async ({ mnemonicPhrase, colorScheme }) => {
    const seed = await getSeedFromMnemonic(mnemonicPhrase)
    const publicKey = getPublicKey(seed)
    const testColorScheme = userColorSchemeService(publicKey).getColorScheme()

    expect(testColorScheme).toEqual(colorScheme)
  })
})
