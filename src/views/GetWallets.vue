<template></template>

<script lang="ts">
/* eslint-disable */
import Vue from 'vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import CryptoInterface from '@/crypto/interface'

type Data = {}

export default Vue.extend({
  name: 'GetWallets',
  mounted(): void {
    window.addEventListener('message', event => {
      if (event.data && event.data.key && event.data.key === `GetWalletsWindow`) {
        if (event.data && event.data.type) {
          if (event.data.type === `GetWallets`) {
            const data = event.data.data
            windowParentPostMessage({
              key: 'GetWalletsWindow',
              message: {}
            })
          }
        }
      }
    })
    windowParentPostMessage({
      key: 'GetWalletsWindow',
      message: {
        type: 'iframeInited'
      }
    })
  },
  data(): Data {
    return {}
  },
  methods: {}
})
</script>

<style lang="scss"></style>
