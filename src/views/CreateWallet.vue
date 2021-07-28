<template>
  <div>
    <div>CREATE WALLET POPUP FRAME</div>
    <enter-password :is-cancel="isCancel" :password="password" @close="cancelCreateWallet" @submit="createWallet" />
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from 'vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import CryptoInterface from '@/crypto/interface'

type Data = {
  password: string
  isCancel: boolean
}

export default Vue.extend({
  name: 'CreateWallet',
  mounted(): void {
    window.addEventListener('message', event => {
      if (event.data && event.data.key && event.data.key === `CreateWalletWindow`) {
        if (event.data && event.data.type) {
          if (event.data.type === `CreateWallet`) {
            const walletData = event.data.walletData
            console.log('>>>>> CreateWallet action', walletData)
          }
        }
      }
    })
    windowParentPostMessage({
      key: 'CreateWalletWindow',
      message: {
        type: 'iframeInited'
      }
    })
  },
  data(): Data {
    return {
      password: '',
      isCancel: false
    }
  },
  methods: {
    createWallet(password): void {
      if (!this.isCancel) {
        this.password = password
        console.log('>>>>> create wallet - password submited', this.password, this.isCancel)
      } else {
        windowParentPostMessage({
          key: 'CreateWalletWindow',
          message: {
            type: 'CancelCreateWallet'
          }
        })
      }
    },
    cancelCreateWallet(): void {
      this.isCancel = true
    }
  }
})
</script>

<style lang="scss"></style>
