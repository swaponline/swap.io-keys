<template>
  <div class="secret-phrase">
    <div class="secret-phrase__inner">
      <template v-if="!isRecoverProfile">
        <show-secret-phrase v-if="!isWritePhrase" :words="words" @next="isWritePhrase = true"></show-secret-phrase>
      </template>
      <template v-if="isWritePhrase || isRecoverProfile">
        <input-secret-phrase
          :words="words"
          :is-recover-profile="isRecoverProfile"
          @create="createProfile"
          @recover="recoverProfile"
          @back="back"
        ></input-secret-phrase>
      </template>
    </div>
    <form-password v-if="formVisible" @close="reject" @submit="resolve" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ShowSecretPhrase from '@/components/Profile/ShowSecretPhrase.vue'
import InputSecretPhrase from '@/components/Profile/InputSecretPhrase.vue'
import FormPassword from '@/components/Profile/FormPassword.vue'
import { mnemonicToSeed } from 'bip39'
import { encryptData, getPublicKey } from '@/utils/chifer'
import { getUserColorTheme } from '@/utils/getUserColorTheme'
import windowParentPostMessage from '@/windowParentPostMessage'
import { getStorage, setStorage } from '@/utils/storage'
import { INIT_IFRAME, REDIRECT_TO_HOME, SET_BACKGROUND } from '@/constants/createProfile'
import { RECOVER_PROFILE, CREATE_PROFILE } from '@/constants/windowKey'
import mnemonic from './mnemonic'

type Data = {
  words: Array<string>
  isWritePhrase: boolean
  formVisible: boolean
}

export default Vue.extend({
  name: 'SecretPhrase',
  components: {
    ShowSecretPhrase,
    InputSecretPhrase,
    FormPassword
  },
  data(): Data {
    return {
      words: [],
      isWritePhrase: false,
      formVisible: false
    }
  },
  computed: {
    isRecoverProfile(): boolean {
      return !mnemonic.card?.wordList
    }
  },
  created(): void {
    if (this.isRecoverProfile) {
      windowParentPostMessage({
        key: RECOVER_PROFILE,
        data: {
          type: INIT_IFRAME,
          loading: false
        }
      })
      this.words = new Array(24).fill('', 0, 24)
      return
    }

    if (mnemonic.card?.wordList.length === 0) {
      this.$router.replace({ name: 'ChooseStyle' })
      return
    }

    this.words = mnemonic.card?.wordList
  },
  methods: {
    back(): void {
      if (this.isRecoverProfile) {
        windowParentPostMessage({
          key: RECOVER_PROFILE,
          message: {
            type: REDIRECT_TO_HOME
          }
        })
      }
      this.isWritePhrase = false
    },

    async createProfile(): Promise<void> {
      try {
        const password = await new Promise((resolve, reject) => {
          this.toggleFormPassword(true, resolve, reject)
        })

        const seed = await mnemonicToSeed(this.words.join(' '))

        if (this.isRecoverProfile) {
          await this.recoverBackground(seed)
        }

        const newProfile = await encryptData(seed, password)
        const profiles = getStorage('profiles') || {}
        profiles[newProfile.publicKey.slice(0, 10)] = newProfile
        setStorage('profiles', profiles)
      } catch (e) {
        console.error(`Create profile reject: ${e}`)
      }

      this.toggleFormPassword(false)

      windowParentPostMessage({
        key: this.isRecoverProfile ? RECOVER_PROFILE : CREATE_PROFILE,
        message: {
          type: REDIRECT_TO_HOME
        }
      })
    },

    toggleFormPassword(visible: boolean, resolve = null, reject = null): void {
      this.formVisible = visible
      this.resolve = resolve
      this.reject = reject
    },

    recoverProfile(recoverWords: Array<string>): void {
      this.words = recoverWords
      this.createProfile()
    },

    recoverBackground(seed: string): Promise<boolean> {
      return new Promise(resolve => {
        const publicKey = getPublicKey(seed)

        windowParentPostMessage({
          key: RECOVER_PROFILE,
          message: {
            type: SET_BACKGROUND,
            selectGradient: getUserColorTheme(publicKey)
          }
        })
        return resolve(true)
      })
    }
  }
})
</script>

<style lang="scss">
.secret-phrase {
  width: 100%;
  max-width: 1064px;
  height: 100%;
  max-height: 555px;
  margin: 20px auto;
  background: $--white;
  flex-grow: 1;
  border-radius: 12px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;

  @include tablet {
    margin: 0 0;
    border-radius: 0;
    max-height: none;
    max-width: none;
  }

  &__inner {
    height: 100%;
  }
}
</style>
