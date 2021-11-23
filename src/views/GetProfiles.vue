/* eslint-disable */

<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import CryptoInterface from '@/crypto/interface'
import { messageTypes } from '@/constants/profile'
import { GET_PROFILES_WINDOW } from '@/constants/windowKey'

export default Vue.extend({
  name: 'GetProfiles',
  mounted(): void {
    const cryptoInterface = new CryptoInterface()
    // @ts-ignore
    const profiles: Record<string, any> = cryptoInterface.getProfiles()
    const retData = {}
    Object.keys(profiles).forEach(profileId => {
      retData[profileId] = profiles[profileId].publicKey
    })

    windowParentPostMessage({
      key: GET_PROFILES_WINDOW,
      message: {
        type: messageTypes.GET_PROFILES,
        profiles: retData
      }
    })
  }
})
</script>

<style lang="scss"></style>
