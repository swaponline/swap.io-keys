<template>
  <div class="recover-profile">
    <swap-stepper class="recover-profile__swapper">
      <template #1="{ changeActiveStep }">
        <div class="recover-profile__mnemonic-phrase-table">
          <recover-profile-header class="recover-profile__header">
            Fill in the missing words
            <template #help-text>
              <swap-help-text class="recover-profile__help-text">
                Lets check your phrase safeness. We took parts of phrase. Fill empty spaces to verify.
              </swap-help-text>
            </template>
          </recover-profile-header>
          <mnemonic-phrase-table :table-matrix="tableMatrix" @change="changeTableMatrix" />

          <div class="recover-profile__buttons">
            <swap-button class="recover-profile__button" @click="recoverCanceled">
              Back
            </swap-button>
            <swap-button
              :disabled="isPhraseWritten"
              :tooltip="isPhraseWritten ? 'Complete your secret phrase.' : null"
              class="recover-profile__button"
              @click="changeActiveStep($options.STEPS[$options.FORM_PASSWORD])"
            >
              Next
            </swap-button>
          </div>
        </div>
      </template>
      <template #2="{ changeActiveStep }">
        <create-profile-form-password v-model="password">
          <template #actions="{ isConfirmPassword }">
            <div class="recover-profile__buttons">
              <swap-button
                class="recover-profile__button"
                @click="changeActiveStep($options.STEPS[$options.MNEMONIC_PHRASE_WRITE])"
              >
                Back
              </swap-button>
              <swap-button
                :disabled="!isConfirmPassword"
                :tooltip="!isConfirmPassword ? 'Please come up with a password.' : null"
                class="recover-profile__button"
                @click="recoverProfile"
              >
                Recover
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
import CreateProfileFormPassword from '@/components/Profile/FormPassword.vue'
import RecoverProfileHeader from '@/components/Profile/Header.vue'
import mnemonicPhraseTable from '@/components/Profile/MnemonicPhraseTable.vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import { profileService } from '@/services/profile'
import { RECOVER_PROFILE_WINDOW } from '@/constants/windowKey'
import { messageTypes, STEPS_CREATE_PROFILE, MNEMONIC_PHRASE_WRITE, FORM_PASSWORD } from '@/constants/profile'

import { TableMatrix } from '@/types/components/profile'

const STEPS = STEPS_CREATE_PROFILE

type Data = {
  password: string
  tableMatrix: TableMatrix
  mnemonicPhrase: string[]
}

export default Vue.extend({
  MNEMONIC_PHRASE_WRITE,
  FORM_PASSWORD,
  STEPS,
  name: 'RecoverProfile',
  components: {
    CreateProfileFormPassword,
    mnemonicPhraseTable,
    RecoverProfileHeader
  },
  data(): Data {
    return {
      password: '',
      tableMatrix: [],
      mnemonicPhrase: []
    }
  },
  computed: {
    isPhraseWritten() {
      const recordedMnemonicPhrase = this.tableMatrix.map(({ value }) => value)
      return recordedMnemonicPhrase.some((word: string) => {
        return word === ''
      })
    }
  },
  created() {
    this.mnemonicPhrase = new Array(24).fill('', 0, 24)
    this.tableMatrix = this.mnemonicPhrase.map((word: string) => {
      return {
        value: word,
        input: true
      }
    })

    windowParentPostMessage({
      key: RECOVER_PROFILE_WINDOW,
      message: {
        type: messageTypes.IFRAME_LOADED
      }
    })
  },
  methods: {
    changeTableMatrix(newTableMatrix: TableMatrix): void {
      this.tableMatrix = newTableMatrix
    },
    recoverCanceled() {
      windowParentPostMessage({
        key: RECOVER_PROFILE_WINDOW,
        message: {
          type: messageTypes.RECOVER_CANCELED
        }
      })
    },
    async recoverProfile() {
      this.mnemonicPhrase = this.tableMatrix.map(({ value }) => value)
      const seed = await profileService.getSeedFromMnemonic(this.mnemonicPhrase)
      const publicKey = profileService.getPublicKey(seed)
      const colorScheme = profileService.getColorScheme(publicKey)

      const { cryptoProfile, shortKey } = await profileService.createProfile({
        seed,
        publicKey,
        mnemonicPhrase: this.mnemonicPhrase
      })
      profileService.saveProfileByShortKey(cryptoProfile, shortKey)

      windowParentPostMessage({
        key: RECOVER_PROFILE_WINDOW,
        message: {
          type: messageTypes.PROFILE_RECOVERED,
          payload: {
            profile: { colorScheme, publicKey: shortKey }
          }
        }
      })
    }
  }
})
</script>

<style lang="scss">
.recover-profile {
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
