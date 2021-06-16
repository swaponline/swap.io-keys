<template>
  <div class="secret-phrase">
    <div class="secret-phrase__inner">
      <template v-if="!isRecoverProfile">
        <show-secret-phrase v-if="!isWritePhrase" :words="words" @next="isWritePhrase = true" />
      </template>
      <template v-if="isWritePhrase || isRecoverProfile">
        <input-secret-phrase
          :words="words"
          :is-recover-profile="isRecoverProfile"
          @create="toggleFormPassword(true)"
          @recover="recoverProfile"
          @back="back"
        />
      </template>
    </div>
    <form-password v-if="isPasswordFormVisible" @close="toggleFormPassword(false)" @submit="createProfile" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import ShowSecretPhrase from '@/components/Profile/ShowSecretPhrase.vue'
import InputSecretPhrase from '@/components/Profile/InputSecretPhrase.vue'
import FormPassword from '@/components/Profile/FormPassword.vue'
import { mnemonicToSeed } from 'bip39'
import { encryptData, getPublicKey } from '@/utils/chifer'
import { getUserColorTheme } from '@/utils/getUserColorTheme'
import windowParentPostMessage from '@/windowParentPostMessage'
import { getStorage, setStorage } from '@/utils/storage'
import { IFRAME_INITED, RECOVER_CANCELED, PROFILE_CREATED, PROFILE_RECOVERED } from '@/constants/createProfile'
import { RECOVER_PROFILE_WINDOW, CREATE_PROFILE_WINDOW } from '@/constants/windowKey'
import { UserColorTheme } from '@/types.d'

type Data = {
  words: Array<string>
  isWritePhrase: boolean
  isPasswordFormVisible: boolean
}

export default Vue.extend({
  name: 'SecretPhrase',
  components: { ShowSecretPhrase, InputSecretPhrase, FormPassword },
  props: {
    theme: { type: Object as PropType<UserColorTheme>, default: () => ({}) }
  },
  data(): Data {
    return {
      words: [],
      isWritePhrase: false,
      isPasswordFormVisible: false
    }
  },
  computed: {
    isRecoverProfile(): boolean {
      return !this.theme.wordList
    }
  },
  mounted(): void {
    if (this.isRecoverProfile) {
      windowParentPostMessage({
        key: RECOVER_PROFILE_WINDOW,
        message: {
          type: IFRAME_INITED,
          payload: {
            loading: false
          }
        }
      })
    }
  },
  created(): void {
    if (this.isRecoverProfile) {
      this.words = new Array(24).fill('', 0, 24)
      return
    }

    this.words = this.theme.wordList
  },
  methods: {
    back(): void {
      if (this.isRecoverProfile) {
        windowParentPostMessage({
          key: RECOVER_PROFILE_WINDOW,
          message: {
            type: RECOVER_CANCELED
          }
        })
      }
      this.isWritePhrase = false
    },

    async createProfile(password: string): Promise<void> {
      try {
        this.toggleFormPassword(false)
        const seed = await mnemonicToSeed(this.words.join(' '))

        const newProfile = await encryptData(seed, password)
        const profiles: Record<string, unknown> = getStorage('profiles') || {}
        const shortKey = newProfile.publicKey.slice(0, 10)
        profiles[shortKey] = newProfile
        setStorage('profiles', profiles)

        if (this.isRecoverProfile) {
          await this.recoverBackground(seed)
        } else {
          const { background, color, selectionColor } = this.theme

          windowParentPostMessage({
            key: CREATE_PROFILE_WINDOW,
            message: {
              type: PROFILE_CREATED,
              payload: {
                profile: { background, color, selectionColor, publicKey: shortKey }
              }
            }
          })
        }
      } catch (e) {
        console.error(`Create profile reject: ${e}`)
      }

      this.toggleFormPassword(false)
    },

    toggleFormPassword(visible: boolean): void {
      this.isPasswordFormVisible = visible
    },

    recoverProfile(recoverWords: Array<string>): void {
      this.words = recoverWords
      this.createProfile()
    },

    recoverBackground(seed: string): Promise<boolean> {
      return new Promise(resolve => {
        const publicKey = getPublicKey(seed)
        const shortKey = publicKey.slice(0, 10)
        const theme = getUserColorTheme(publicKey)

        windowParentPostMessage({
          key: RECOVER_PROFILE_WINDOW,
          message: {
            type: PROFILE_RECOVERED,
            payload: {
              profile: { ...theme, publicKey: shortKey }
            }
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
  height: 100%;

  &__inner {
    height: 100%;
  }
}
</style>
