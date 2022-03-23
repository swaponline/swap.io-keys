import { createProfileService } from '@/services/profile'
import * as storageService from '@/utils/storage'
import * as cipher from '@/utils/cipher'
import {
  MOCK_MNEMONIC_PHRASE,
  profile1,
  profile2,
  DEFAULT_PROFILE_PARAMETERS,
  TEST_CRYPTO_PROFILE,
  PUBLIC_KEY,
  SHORT_PUBLIC_KEY
} from '../__mocks__/profileService.mock'

describe('Profile service', () => {
  let profileService

  const localStorage = {}
  const NEW_PROFILES = [profile1, profile2]
  const SELECTED_PROFILE_PARAMETERS = profile1

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  storageService.getStorage = jest.fn().mockImplementation(key => localStorage[key])
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  storageService.setStorage = jest.fn().mockImplementation((key, value) => {
    localStorage[key] = value
  })

  afterEach(() => {
    profileService = null
  })

  it('Sets and returns profiles parameters', () => {
    profileService = createProfileService()

    profileService.setProfilesParameters(NEW_PROFILES)

    expect(profileService.getProfilesParameters()).toEqual(NEW_PROFILES)
  })

  it('Sets and returns selected profile parameters', () => {
    profileService = createProfileService()
    profileService.setSelectedProfileParameters(SELECTED_PROFILE_PARAMETERS)

    expect(profileService.getSelectedProfileParameters()).toEqual(SELECTED_PROFILE_PARAMETERS)
  })

  it('Profile parameters are reset', () => {
    profileService = createProfileService()

    profileService.setProfilesParameters(NEW_PROFILES)

    expect(profileService.getProfilesParameters()).toEqual(NEW_PROFILES)

    profileService.resetProfilesParameters()

    expect(profileService.getProfilesParameters()).toEqual([])
  })

  it('Selected profile parameters are reset', () => {
    profileService = createProfileService()
    profileService.setSelectedProfileParameters(SELECTED_PROFILE_PARAMETERS)

    expect(profileService.getSelectedProfileParameters()).toEqual(SELECTED_PROFILE_PARAMETERS)

    profileService.resetSelectedProfileParameters()

    expect(profileService.getSelectedProfileParameters()).toEqual(DEFAULT_PROFILE_PARAMETERS)
  })

  it('The profile is being created', async () => {
    profileService = createProfileService()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cipher.encryptData = jest.fn().mockImplementation(() => {
      return TEST_CRYPTO_PROFILE
    })

    const seed = await profileService.getSeedFromMnemonic(MOCK_MNEMONIC_PHRASE)
    const password = '123456'

    const cryptoProfile = await profileService.createProfile({
      seed,
      publicKey: PUBLIC_KEY,
      mnemonicPhrase: MOCK_MNEMONIC_PHRASE,
      password
    })

    expect(cryptoProfile).toEqual({ cryptoProfile: TEST_CRYPTO_PROFILE, shortKey: SHORT_PUBLIC_KEY })
  })

  it('The created profile is recorded in localStorage using a short key', () => {
    profileService = createProfileService()

    profileService.saveProfileByShortKey(TEST_CRYPTO_PROFILE, SHORT_PUBLIC_KEY)

    const profiles = {
      [SHORT_PUBLIC_KEY]: TEST_CRYPTO_PROFILE
    }

    expect(storageService.setStorage).toBeCalledWith('profiles', profiles)
  })
})
