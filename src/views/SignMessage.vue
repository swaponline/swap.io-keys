<template>
  <div>
    <enter-password :is-cancel="isCancel" :password="password" @close="cancelSignMessage" @submit="signMessage" />
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
  signData: unknown
}

export default Vue.extend({
  name: 'SignMessage',
  mounted(): void {
    window.addEventListener('message', event => {
      if (event.data && event.data.key && event.data.key === `SignMessageWindow`) {
        if (event.data && event.data.type) {
          if (event.data.type === `SignMessage`) {
            const signData = event.data.data
            this.signData = signData
          }
        }
      }
    })
    windowParentPostMessage({
      key: 'SignMessageWindow',
      message: {
        type: 'iframeLoaded'
      }
    })
  },
  data(): Data {
    return {
      password: '',
      isCancel: false,
      signData: false
    }
  },
  methods: {
    signMessage(password): void {
      new Promise(async resolve => {
        if (!this.isCancel) {
          this.password = password
          const cInterface = new CryptoInterface()
          const network = await cInterface.getNetworkAdaptor(this.signData.networkId)
          cInterface.accessProfileByKey(this.signData.profileId, this.password).then(async profile => {
            // @ts-ignore
            const signedMessage = profile.signMessage(network, this.signData.message)
            windowParentPostMessage({
              key: 'SignMessageWindow',
              message: {
                type: 'MessageSigned',
                signedMessage
              }
            })
          })
        } else {
          windowParentPostMessage({
            key: 'SignMessageWindow',
            message: {
              type: 'CancelMessageSign'
            }
          })
        }
        resolve(true)
      })
    },
    cancelSignMessage(): void {
      this.isCancel = true
    }
  }
})
</script>

<style lang="scss"></style>
