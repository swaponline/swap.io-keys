<template>
  <div class="secret-phrase">
    <div class="secret-phrase__inner">
      <show-secret-phrase v-if="!isWritePhrase" :words="words" @next="isWritePhrase = true"></show-secret-phrase>
      <input-secret-phrase v-else :words="words" @create="create" @back="back"></input-secret-phrase>
      <form-password v-if="formPasswordVisible" @close="reject" @submit="resolve"></form-password>
    </div>
  </div>
</template>

<script>
import { mnemonicToSeedSync } from 'bip39'
import { encryptData, decryptData } from '@/utils/chifer'
// import windowParentPostMessage from '@/windowParentPostMessage'

import { MODULE_NAME as PROFILE_MODULE } from '@/store/modules/Profile'
import ShowSecretPhrase from '@/components/Profile/ShowSecretPhrase.vue'
import InputSecretPhrase from '@/components/Profile/InputSecretPhrase.vue'
import FormPassword from '@/components/Profile/FormPassword.vue'

export default {
  name: 'SecretPhrase',
  components: {
    ShowSecretPhrase,
    InputSecretPhrase,
    FormPassword
  },
  data() {
    return {
      formPasswordVisible: false,
      isWritePhrase: false,
      resolve: undefined,
      reject: undefined
    }
  },
  computed: {
    words() {
      return this.$store.state[PROFILE_MODULE].model.wordList
    }
  },
  created() {
    if (this.words.length === 0) {
      this.$router.replace({ name: 'ChooseStyle' })
    }
  },
  methods: {
    back() {
      this.isWritePhrase = false
    },
    async create() {
      try {
        const pass = await new Promise((resolve, reject) => {
          this.formPasswordVisible = true
          this.resolve = resolve
          this.reject = reject
        })
        const a = JSON.parse(window.localStorage.getItem('profile')) || {}
        const mnemonic = this.words.join(' ')
        const seed = mnemonicToSeedSync(mnemonic).toString('hex')
        const aesMnemonic = await encryptData(seed, pass)

        a[aesMnemonic.publicKey.slice(0, 10)] = aesMnemonic

        window.localStorage.setItem('profile', JSON.stringify(a))
        // windowParentPostMessage({ key: 'profile', callbackName: 'close' })
      } catch (e) {
        this.formPasswordVisible = false
      }
      this.formPasswordVisible = false
      this.resolve = undefined
      this.reject = undefined

      // тут просто проверка на правильность декодера
      const pass = await new Promise((resolve, reject) => {
        this.formPasswordVisible = true
        this.resolve = resolve
        this.reject = reject
      })
      const a = JSON.parse(window.localStorage.getItem('profile')) || {}
      const keys = Object.keys(a)
      for (let i = 0; i < keys.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const seed = await decryptData(a[keys[i]], pass)
        console.log('seed', seed)
      }
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
