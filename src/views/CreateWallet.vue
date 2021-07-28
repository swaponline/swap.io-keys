<template>
  <div></div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from 'vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import CryptoInterface from '@/crypto/interface'

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
  }
})
</script>

<style lang="scss"></style>
