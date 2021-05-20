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

<script>
import ShowSecretPhrase from '@/components/Profile/ShowSecretPhrase.vue'
import InputSecretPhrase from '@/components/Profile/InputSecretPhrase.vue'
import FormPassword from '@/components/Profile/FormPassword.vue'
import { mnemonicToSeedSync } from 'bip39'
import { encryptData } from '@/utils/chifer'
import { getStorage, setStorage } from '@/utils/storage'
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
  computed: {
    isRecoverProfile() {
      return !mnemonic.card?.wordList
    }
  },
  created() {
    if (this.isRecoverProfile) {
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
    back() {
      this.isWritePhrase = false
    },

    async createProfile() {
      try {
        const password = await new Promise((resolve, reject) => {
          this.toggleFormPassword(true, resolve, reject)
        })

        const seed = mnemonicToSeedSync(this.words.join(' '))
        const newProfile = await encryptData(seed, password)
        const profiles = JSON.parse(getStorage('profiles')) || {}
        profiles[newProfile.publicKey.slice(0, 10)] = newProfile

        setStorage('profiles', JSON.stringify(profiles))
      } catch (e) {
        console.error(`Create profile reject: ${e}`)
      }

      this.toggleFormPassword(false)
    },

    toggleFormPassword(visible, resolve = null, reject = null) {
      this.formVisible = visible
      this.resolve = resolve
      this.reject = reject
    },

    recoverProfile(recoverWords) {
      this.words = recoverWords
      this.createProfile()
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
