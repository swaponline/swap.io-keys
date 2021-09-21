/* eslint-disable */

<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import CryptoInterface from '@/crypto/interface'
import { GET_PROFILES } from '@/constants/createProfile'
import { GET_PROFILES_WINDOW } from '@/constants/windowKey'

export default Vue.extend({
  name: 'GetProfiles',
  mounted(): void {
    const cryptoInterface = new CryptoInterface()
    // @ts-ignore
    const profiles: Record<string, any> = cryptoInterface.getProfiles()
    console.log('profiles', profiles)
    const retData = {}
    Object.keys(profiles).forEach(profileId => {
      retData[profileId] = profiles[profileId].publicKey
    })

    console.log('profileKeys', retData)
    windowParentPostMessage({
      key: GET_PROFILES_WINDOW,
      message: {
        type: GET_PROFILES,
        profiles: retData
      }
    })
  }
})
</script>

<style lang="scss"></style>
