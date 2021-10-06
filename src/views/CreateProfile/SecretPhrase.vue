<template>
  <div class="secret-phrase">
    <secret-phrase-show
      :is-recover-profile="isRecoverProfile"
      :words="words"
      @create="toggleFormPassword(true)"
      @recover="recoverProfile"
    />
    <form-password v-if="isPasswordFormVisible" @close="toggleFormPassword(false)" @submit="createProfile" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import SecretPhraseShow from '@/components/CreateProfile/SecretPhrase/Show.vue'
import FormPassword from '@/components/CreateProfile/FormPassword.vue'
import { encryptData } from '@/utils/cipher'
import { getUserTheme } from '@/utils/userTheme'
import windowParentPostMessage from '@/windowParentPostMessage'
import { getStorage, setStorage } from '@/utils/storage'
import { CREATION_CANCELLED, IFRAME_INITED, PROFILE_CREATED, PROFILE_RECOVERED } from '@/constants/createProfile'
import { CREATE_PROFILE_WINDOW, RECOVER_PROFILE_WINDOW } from '@/constants/windowKey'
import { UserTheme } from '@/types/userTheme'
import { ESCAPE } from '@/constants/keyCodes'

type Data = {
  words: Array<string>
  isPasswordFormVisible: boolean
  localTheme: []
}

export default Vue.extend({
  name: 'SecretPhrase',
  components: {
    SecretPhraseShow,
    FormPassword
  },
  props: {
    theme: { type: Object as PropType<UserTheme>, default: () => ({}) }
  },
  data(): Data {
    return {
      words: [],
      localTheme: [],
      isPasswordFormVisible: false
    }
  },
  computed: {
    isRecoverProfile(): boolean {
      return !this.theme.wordList
    },
    shortPublicKey() {
      return this.localTheme.publicKey.toString('hex').slice(0, 10)
    }
  },
  watch: {
    theme: {
      immediate: true,
      handler(newTheme) {
        this.localTheme = newTheme
      }
    }
  },
  created(): void {
    document.addEventListener('keydown', this.closeByPressingESC)

    if (this.isRecoverProfile) {
      this.words = new Array(24).fill('', 0, 24)
      return
    }
    this.words = this.localTheme.wordList
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
  beforeDestroy() {
    document.removeEventListener('keydown', this.closeByPressingESC)
  },
  methods: {
    closeByPressingESC({ key }) {
      if (key === ESCAPE) {
        windowParentPostMessage({
          key: this.isRecoverProfile ? RECOVER_PROFILE_WINDOW : CREATE_PROFILE_WINDOW,
          message: {
            type: CREATION_CANCELLED
          }
        })
      }
    },
    async createProfile(password: string): Promise<void> {
      this.toggleFormPassword(false)

      const { seed, publicKey, wordList, colorScheme } = this.localTheme

      const newProfile = await encryptData(seed, publicKey, wordList.join(' '), password)
      const profiles: Record<string, unknown> = getStorage('profiles') || {}
      const shortKey = this.shortPublicKey

      profiles[shortKey] = { ...newProfile, colorScheme }

      setStorage('profiles', profiles)

      windowParentPostMessage({
        key: this.isRecoverProfile ? RECOVER_PROFILE_WINDOW : CREATE_PROFILE_WINDOW,
        message: {
          type: this.isRecoverProfile ? PROFILE_RECOVERED : PROFILE_CREATED,
          payload: {
            profile: { colorScheme, publicKey: shortKey }
          }
        }
      })
    },

    toggleFormPassword(visible: boolean): void {
      this.isPasswordFormVisible = visible
    },

    async recoverProfile(recoverWords: Array<string>): Promise<void> {
      this.localTheme = await getUserTheme(recoverWords)
      this.toggleFormPassword(true)
    }
  }
})
</script>

<style lang="scss">
.secret-phrase {
  height: 100%;
  padding: 32px 110px 40px;

  @include tablet {
    padding: 30px 25px 25px;
  }

  @include phone {
    padding: 28px 20px 20px;
  }
}
</style>
