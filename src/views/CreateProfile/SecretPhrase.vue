<template>
  <div class="secret-phrase">
    <secret-phrase-table
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
import SecretPhraseTable from '@/components/Profile/SecretPhraseTable.vue'
import FormPassword from '@/components/Profile/FormPassword.vue'
import { encryptData } from '@/utils/cipher'
import { getUserTheme } from '@/utils/userTheme'
import windowParentPostMessage from '@/windowParentPostMessage'
import { getStorage, setStorage } from '@/utils/storage'
import { IFRAME_INITED, PROFILE_CREATED, PROFILE_RECOVERED } from '@/constants/createProfile'
import { RECOVER_PROFILE_WINDOW, CREATE_PROFILE_WINDOW } from '@/constants/windowKey'
import { UserTheme } from '@/types/userTheme'

type Data = {
  words: Array<string>
  isPasswordFormVisible: boolean
  localTheme: []
}

export default Vue.extend({
  name: 'SecretPhrase',
  components: {
    SecretPhraseTable,
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
    this.words = this.localTheme.wordList
  },
  methods: {
    async createProfile(password: string): Promise<void> {
      this.toggleFormPassword(false)

      const { seed, publicKey } = this.localTheme

      const newProfile = await encryptData(seed, publicKey, password)
      const profiles: Record<string, unknown> = getStorage('profiles') || {}
      const shortKey = this.shortPublicKey

      profiles[shortKey] = newProfile

      setStorage('profiles', profiles)

      const { colorScheme } = this.localTheme

      windowParentPostMessage({
        key: this.isRecoverProfile ? RECOVER_PROFILE_WINDOW : CREATE_PROFILE_WINDOW,
        message: {
          type: this.isRecoverProfile ? PROFILE_RECOVERED : PROFILE_CREATED,
          payload: {
            profile: { ...colorScheme, publicKey: shortKey }
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
}
</style>
