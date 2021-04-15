<template>
  <div class="secret-phrase">
    <div class="secret-phrase__inner">
      <show-secret-phrase v-if="!isWritePhrase" :words="words" @next="isWritePhrase = true"></show-secret-phrase>
      <input-secret-phrase v-else :words="words" @create="createProfile" @back="back"></input-secret-phrase>
    </div>
    <form-password v-if="formVisible" @close="reject" @submit="resolve" />
  </div>
</template>

<script>
import ShowSecretPhrase from '@/components/Profile/ShowSecretPhrase.vue'
import InputSecretPhrase from '@/components/Profile/InputSecretPhrase.vue'
import FormPassword from '@/components/Profile/FormPassword.vue'
import { mnemonicToSeedSync } from 'bip39'
import { encryptData } from '@/utils/chifer'
import { getStorage, setStorage } from '@/utils/storage'
import windowParentPostMessage from '@/windowParentPostMessage'
import mnemonic from './mnemonic'

export default {
  name: 'SecretPhrase',
  components: {
    ShowSecretPhrase,
    InputSecretPhrase,
    FormPassword
  },
  data() {
    return {
      words: [],
      isWritePhrase: false,
      currentWindow: null,
      formVisible: false,
      resolve: null,
      reject: null
    }
  },
  created() {
    if (mnemonic.card.wordList.length === 0) {
      this.$router.replace({ name: 'ChooseStyle' })
    } else {
      this.words = mnemonic.card.wordList
    }
  },
  methods: {
    back() {
      this.isWritePhrase = false
    },
    async createProfile() {
      try {
        const password = await new Promise((resolve, reject) => {
          this.formVisible = true
          this.resolve = resolve
          this.reject = reject
        })
        const seed = mnemonicToSeedSync(this.words.join(' '))
        const newProfile = await encryptData(seed, password)
        const profiles = JSON.parse(getStorage('profiles')) || {}
        profiles[newProfile.publicKey.slice(0, 10)] = newProfile
        setStorage('profiles', JSON.stringify(profiles))
        windowParentPostMessage({ key: 'CreateProfile', newProfile })
      } catch (e) {
        console.error(`Create profile reject: ${e}`)
      }
      this.formVisible = false
      this.resolve = null
      this.reject = null
    }
  }
}
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
