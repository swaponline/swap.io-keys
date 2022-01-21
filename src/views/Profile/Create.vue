<template>
  <div class="create-profile">
    <swap-stepper class="create-profile__swapper">
      <template #1="{ changeActiveStep }">
        <create-profile-select-color-scheme
          :selected-color-scheme.sync="selectedProfileParameters.colorScheme"
          :options="colorSchemes"
          @refresh-color-schemes="refreshProfilesParameters"
          @select-color-scheme="installSelectedProfileParameters"
        >
          <template #actions>
            <div class="create-profile__buttons">
              <swap-button class="create-profile__button" @click="cancelCreation">Back</swap-button>
              <swap-button
                :disabled="!isColorSchemeSelected"
                :tooltip="!isColorSchemeSelected ? 'Please pick a color scheme to proceed.' : null"
                class="create-profile__button"
                @click="goToStepShowMnemonicPhrase(changeActiveStep)"
              >
                Next
              </swap-button>
            </div>
          </template>
        </create-profile-select-color-scheme>
      </template>
      <template #2="{ changeActiveStep }">
        <div class="create-profile__mnemonic-phrase-table">
          <create-profile-header class="create-profile__header">
            Your secret phrase
            <template #help-text>
              <swap-help-text class="create-profile__help-text">
                Back this up on a piece of paper. Label the paper as swap.io to remind you where to use it. Do not save
                the phrase on your device. Do not take photos of this phrase. Keep the piece of paper in a safe place.
              </swap-help-text>
            </template>
          </create-profile-header>
          <mnemonic-phrase-table :table-matrix="tableMatrix" />
          <div class="create-profile__buttons">
            <swap-button
              class="create-profile__button"
              @click="changeActiveStep($options.constants.STEPS[$options.constants.SELECT_COLOR_SCHEME])"
            >
              Back
            </swap-button>
            <swap-button class="create-profile__button" @click="goToStepWriteMnemonicPhrase(changeActiveStep)">
              Next
            </swap-button>
          </div>
        </div>
      </template>
      <template #3="{ changeActiveStep }">
        <div class="create-profile__mnemonic-phrase-table">
          <create-profile-header class="create-profile__header">
            Fill in the missing words
            <template #help-text>
              <swap-help-text class="create-profile__help-text create-profile__help-text--small">
                Lets check your phrase safeness. We took parts of phrase. Fill empty spaces to verify.
              </swap-help-text>
            </template>
          </create-profile-header>
          <mnemonic-phrase-table :table-matrix="tableMatrix" @change="changeTableMatrix" />
          <div class="create-profile__buttons">
            <swap-button class="create-profile__button" @click="goToStepShowMnemonicPhrase(changeActiveStep)">
              Back
            </swap-button>
            <swap-button
              :disabled="isPhraseFilledIncorrectly"
              :tooltip="isPhraseFilledIncorrectly ? 'Complete your secret phrase.' : null"
              class="create-profile__button"
              @click="changeActiveStep($options.constants.STEPS[$options.constants.FORM_PASSWORD])"
            >
              Next
            </swap-button>
          </div>
        </div>
      </template>
      <template #4="{ changeActiveStep }">
        <create-profile-form-password v-model="selectedProfileParameters.encryptionParameters.password">
          <template #actions="{ isValidPassword }">
            <div class="create-profile__buttons">
              <swap-button
                class="create-profile__button"
                @click="changeActiveStep($options.constants.STEPS[$options.constants.MNEMONIC_PHRASE_WRITE])"
              >
                Back
              </swap-button>
              <swap-button
                :disabled="!isValidPassword"
                :tooltip="!isValidPassword ? 'Please come up with a password.' : null"
                class="create-profile__button"
                @click="createProfile"
              >
                Created
              </swap-button>
            </div>
          </template>
        </create-profile-form-password>
      </template>
    </swap-stepper>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SwapStepper from '@/components/UI/SwapStepper.vue'
import CreateProfileSelectColorScheme from '@/components/Profile/SelectColorScheme.vue'
import CreateProfileFormPassword from '@/components/Profile/FormPassword.vue'
import CreateProfileHeader from '@/components/Profile/Header.vue'
import mnemonicPhraseTable from '@/components/Profile/MnemonicPhraseTable.vue'

import windowParentPostMessage from '@/windowParentPostMessage'
import { profileService } from '@/services/profile'
import { getStorage } from '@/utils/storage'
import { getRandomIntegers, setCSSCustomProperty } from '@/utils/common'
import { ESCAPE } from '@/constants/keyCodes'
import { DARK_THEME_KEY, THEME_KEY } from '@/constants/theme'
import { CREATE_PROFILE_WINDOW } from '@/constants/windowKey'
import {
  STEPS_CREATE_PROFILE,
  SELECT_COLOR_SCHEME,
  MNEMONIC_PHRASE_SHOW,
  MNEMONIC_PHRASE_WRITE,
  FORM_PASSWORD
} from '@/constants/profile'
import { iframeMessageTypes, profileMessageTypes } from '@/constants/messageTypes'
import { ColorScheme } from '@/types/generators'
import { EncryptionParameters, MnemonicPhrase } from '@/types/encryptionParameters'
import { ProfileParameters } from '@/types/profileParameters'
import { ChangeActiveStep } from '@/types/components/UI/swapStepper'
import { TableMatrix } from '@/types/components/profile'

const INPUTS_COUNT = 6

const STEPS = STEPS_CREATE_PROFILE

type Data = {
  profilesParameters: Array<ProfileParameters>
  selectedProfileParameters: ProfileParameters
  tableMatrix: TableMatrix
  isRefreshing: boolean
}

const PROFILES_COUNT = 4

async function getProfileParameters(): Promise<ProfileParameters> {
  const mnemonicPhrase = profileService.getMnemonicPhrase()
  const seed = await profileService.getSeedFromMnemonic(mnemonicPhrase)
  const publicKey = profileService.getPublicKey(seed)
  const password = ''

  const colorScheme = profileService.getColorScheme(publicKey)

  return {
    colorScheme,
    encryptionParameters: {
      mnemonicPhrase,
      seed,
      publicKey,
      password
    }
  }
}
export default Vue.extend({
  constants: {
    SELECT_COLOR_SCHEME,
    MNEMONIC_PHRASE_WRITE,
    FORM_PASSWORD,
    STEPS
  },
  name: 'CreateProfile',
  components: {
    SwapStepper,
    CreateProfileSelectColorScheme,
    mnemonicPhraseTable,
    CreateProfileFormPassword,
    CreateProfileHeader
  },

  data(): Data {
    return {
      profilesParameters: profileService.getProfilesParameters(),
      selectedProfileParameters: profileService.getSelectedProfileParameters(),
      tableMatrix: [],
      isRefreshing: false
    }
  },
  computed: {
    selectedColorScheme(): void {
      return this.selectedProfileParameters.colorScheme
    },
    mnemonicPhrase(): MnemonicPhrase {
      return this.selectedProfileParameters.encryptionParameters.mnemonicPhrase
    },
    isColorSchemeSelected(): boolean {
      return this.selectedColorScheme.background
    },
    colorSchemes(): ColorScheme[] {
      return this.profilesParameters.map(({ colorScheme }) => colorScheme)
    },
    isPhraseFilledIncorrectly(): boolean {
      const recordedMnemonicPhrase = this.tableMatrix.map(({ value }) => value)
      return recordedMnemonicPhrase.toString() !== this.mnemonicPhrase.toString()
    }
  },
  async created(): Promise<void> {
    if (!this.profilesParameters.length) {
      this.profilesParameters = await this.getProfilesParameters(PROFILES_COUNT)
      profileService.setProfilesParameters(this.profilesParameters)
    }

    document.addEventListener('keydown', this.closeByPressingESC)

    windowParentPostMessage({
      key: CREATE_PROFILE_WINDOW,
      message: {
        type: iframeMessageTypes.IFRAME_RENDERED
      }
    })

    if (this.isColorSchemeSelected) {
      this.installSelectedColorScheme(this.selectedColorScheme)
    }
  },
  beforeDestroy(): void {
    document.removeEventListener('keydown', this.closeByPressingESC)
    this.cancelCreation()
  },
  methods: {
    getDefaultTableMatrix(): TableMatrix {
      return this.mnemonicPhrase.map((word: string) => {
        return {
          value: word,
          input: false
        }
      })
    },
    changeTableMatrix(newTableMatrix: TableMatrix): void {
      this.tableMatrix = newTableMatrix
    },
    async getProfilesParameters(count: number): Promise<ProfileParameters[]> {
      const profilesParametersResolvers: Promise<ProfileParameters>[] = []

      for (let i = 0; i < count; i += 1) {
        const profileParameters = getProfileParameters()
        profilesParametersResolvers.push(profileParameters)
      }

      const profilesParameters = await Promise.all(profilesParametersResolvers)
      return profilesParameters
    },
    async refreshProfilesParameters(): Promise<void> {
      if (!this.isRefreshing) {
        this.isRefreshing = true
        this.profilesParameters = await this.getProfilesParameters(PROFILES_COUNT)
        profileService.setProfilesParameters(this.profilesParameters)
        this.isRefreshing = false
      }
    },
    installSelectedProfileParameters(): void {
      const { colorScheme } = this.selectedProfileParameters
      this.installSelectedColorScheme(colorScheme)
      // get encryption parameters for the selected topic
      this.selectedProfileParameters.encryptionParameters = this.getEncryptionParametersToSelectedColorScheme(
        colorScheme
      )

      profileService.setSelectedProfileParameters(this.selectedProfileParameters)
    },
    installSelectedColorScheme(selectedColorScheme: ColorScheme): void {
      this.selectedProfileParameters.colorScheme = selectedColorScheme

      const appTheme = getStorage(THEME_KEY)

      const { colorForDarkTheme, color, selectionColor } = selectedColorScheme
      if (appTheme === DARK_THEME_KEY) {
        setCSSCustomProperty('main-color', colorForDarkTheme)
      } else {
        setCSSCustomProperty('main-color', color)
      }

      setCSSCustomProperty('selection-color', selectionColor)

      windowParentPostMessage({
        key: CREATE_PROFILE_WINDOW,
        message: {
          type: profileMessageTypes.THEME_SELECTED,
          payload: {
            colorScheme: selectedColorScheme
          }
        }
      })
    },

    getEncryptionParametersToSelectedColorScheme(selectedColorScheme: ColorScheme): EncryptionParameters {
      const selectedProfileParameters = this.profilesParameters.find((parameters: ProfileParameters) => {
        return parameters.colorScheme.background === selectedColorScheme.background
      })

      return selectedProfileParameters.encryptionParameters
    },
    cancelCreation(): void {
      profileService.resetProfilesParameters()
      profileService.resetSelectedProfileParameters()

      windowParentPostMessage({
        key: CREATE_PROFILE_WINDOW,
        message: {
          type: profileMessageTypes.CREATION_CANCELLED
        }
      })
    },
    goToStepShowMnemonicPhrase(changeActiveStep: ChangeActiveStep): void {
      this.tableMatrix = this.getDefaultTableMatrix()
      changeActiveStep(STEPS[MNEMONIC_PHRASE_SHOW])
    },
    goToStepWriteMnemonicPhrase(changeActiveStep: ChangeActiveStep): void {
      const modifiedTableMatrix: TableMatrix = [...this.tableMatrix]
      const randomIntegers = getRandomIntegers(INPUTS_COUNT, modifiedTableMatrix.length - 1)

      randomIntegers.forEach(replacementIndex => {
        modifiedTableMatrix[replacementIndex] = {
          value: '',
          input: true
        }
      })

      this.tableMatrix = modifiedTableMatrix
      changeActiveStep(STEPS[MNEMONIC_PHRASE_WRITE])
    },

    async createProfile(): Promise<void> {
      const { colorScheme, encryptionParameters } = this.selectedProfileParameters

      const { cryptoProfile, shortKey } = await profileService.createProfile(encryptionParameters)
      profileService.saveProfileByShortKey(cryptoProfile, shortKey)

      profileService.resetProfilesParameters()
      profileService.resetSelectedProfileParameters()

      windowParentPostMessage({
        key: CREATE_PROFILE_WINDOW,
        message: {
          type: profileMessageTypes.PROFILE_CREATED,
          payload: {
            profile: { colorScheme, publicKey: shortKey }
          }
        }
      })
    },
    closeByPressingESC({ key }): void {
      if (key === ESCAPE) {
        this.cancelCreation()
      }
    }
  }
})
</script>

<style lang="scss">
.create-profile {
  height: 100%;

  &__swapper {
    height: 100%;
  }

  &__mnemonic-phrase-table {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 32px 110px 40px;

    @include tablet {
      padding: 30px 25px 25px;
    }

    @include phone {
      padding: 28px 20px 20px;
    }
  }

  &__header {
    margin-bottom: 44px;

    @include tablet {
      margin-bottom: 75px;
    }

    @include phone {
      margin-bottom: 50px;
    }

    @include small-phone {
      margin-bottom: 30px;
    }
  }

  &__help-text {
    max-width: 520px;

    @include tablet {
      max-width: 500px;
    }

    &--small {
      max-width: 275px;
    }
  }

  &__buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: auto;
  }

  &__button {
    width: 180px;

    &:not(:last-child) {
      margin-right: 10px;
    }

    @include tablet {
      width: 100%;
    }

    .swap-button__content {
      font-weight: $--font-weight-semi-bold;
    }
  }
}
</style>
