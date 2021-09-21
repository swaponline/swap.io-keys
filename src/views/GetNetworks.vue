<template>
  <div></div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from 'vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import CryptoInterface from '@/crypto/interface'

export default Vue.extend({
  name: 'GetNetworks',
  mounted(): void {
    const cryptoInterface = new CryptoInterface()
    // @ToDo - remove
    /*
    const adaptors = cryptoInterface.getNetworkAdaptors()
    const networks = adaptors.map(adaptor => {
      return {
        symbol: adaptor.getSymbol(),
        name: adaptor.getName(),
        priority: adaptor.getPriority(),
        coin: adaptor.getCoin()
      }
    }).sort((a,b) => a.priority - b.priority)
    windowParentPostMessage({
      key: 'GetNetworksWindow',
      message: {
        type: 'iframeGetNetworks',
        networks
      }
    })
    */
  }
})
</script>

<style lang="scss"></style>
