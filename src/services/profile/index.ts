import { encryptData, getMnemonicPhrase, getPublicKey, getSeedFromMnemonic } from '@/utils/cipher'
import { getStorage, setStorage } from '@/utils/storage'
import { UserColorScheme } from '@/utils/generators/background'
import { cloneDeep } from '@/utils/common'
import { ProfileParameters } from '@/types/profileParameters'
import { ProfileService } from '@/types/services/profileService'

const SELECTED_PROFILE_PARAMETERS_KEY = 'selectedProfileParametersKey'
const PROFILES_PARAMETERS_KEY = 'profilesParametersKey'

function getDefaultProfileParameters(): ProfileParameters {
  return {
    colorScheme: {
      background: '',
      color: '',
      colorForDarkTheme: '',
      selectionColor: ''
    },
    encryptionParameters: {
      mnemonicPhrase: [],
      publicKey: null,
      seed: null
    }
  }
}

export function createProfileService(): ProfileService {
  let selectedProfileParameters: ProfileParameters =
    getStorage(SELECTED_PROFILE_PARAMETERS_KEY) || getDefaultProfileParameters()
  let profilesParameters: ProfileParameters[] = getStorage(PROFILES_PARAMETERS_KEY) || []

  function getShortPublicKey(publicKey): string {
    return publicKey.toString('hex').slice(0, 10)
  }

  return {
    getMnemonicPhrase,
    getPublicKey,
    getSeedFromMnemonic,
    getColorScheme(publicKey) {
      return new UserColorScheme(publicKey).getColorScheme()
    },

    getProfilesParameters() {
      return cloneDeep(profilesParameters)
    },

    setProfilesParameters(newProfilesParameters) {
      profilesParameters = newProfilesParameters
      setStorage(PROFILES_PARAMETERS_KEY, profilesParameters)
    },

    resetProfilesParameters() {
      this.setProfilesParameters([])
    },

    getSelectedProfileParameters() {
      return cloneDeep(selectedProfileParameters)
    },

    setSelectedProfileParameters(newSelectedProfileParameters) {
      selectedProfileParameters = newSelectedProfileParameters
      setStorage(SELECTED_PROFILE_PARAMETERS_KEY, selectedProfileParameters)
    },

    resetSelectedProfileParameters() {
      const defaultProfileParameters = getDefaultProfileParameters()
      this.setSelectedProfileParameters(defaultProfileParameters)
    },

    async createProfile({ seed, publicKey, mnemonicPhrase, password }) {
      if (seed && publicKey && mnemonicPhrase) {
        const cryptoProfile = await encryptData(seed, publicKey, mnemonicPhrase.join(' '), password)
        const shortKey = getShortPublicKey(publicKey)

        return {
          cryptoProfile,
          shortKey
        }
      }

      throw new Error('The values of seed, publicKey and mnemonicPhrase were not passed')
    },

    saveProfileByShortKey(cryptoProfile, shortKey: string) {
      const profiles: Record<string, unknown> = getStorage('profiles') || {}

      profiles[shortKey] = cryptoProfile
      setStorage('profiles', profiles)
    }
  }
}

const profileService = createProfileService()
export { profileService }
