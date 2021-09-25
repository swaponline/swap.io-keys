<template></template>

<script lang="ts">
/* eslint-disable */
import Vue from 'vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import CryptoInterface from '@/crypto/interface'

type Data = {}

export default Vue.extend({
  name: 'SignMessage',
  mounted(): void {
    window.addEventListener('message', event => {
      if (event.data && event.data.key && event.data.key === `ValidateMessageWindow`) {
        if (event.data && event.data.type) {
          if (event.data.type === `ValidateMessage`) {
            const validateData = event.data.data
            const cInterface = new CryptoInterface()
            cInterface.validateMessage(validateData).then((isValid) => {
              windowParentPostMessage({
                key: 'ValidateMessageWindow',
                message: {
                  type: 'MessageValidated',
                  isValid
                }
              })
            })
          }
        }
      }
    })
    windowParentPostMessage({
      key: 'ValidateMessageWindow',
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
