<template>
  <div>
    <enter-password :is-cancel="isCancel" :password="password" @close="cancelCreateWallets" @submit="createWallets" />
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
  profileId: string
  walletsData: Array<unknown>
}

export default Vue.extend({
  name: 'CreateWallets',
  mounted(): void {
    window.addEventListener('message', event => {
      if (event.data && event.data.key && event.data.key === `CreateWalletsWindow`) {
        if (event.data && event.data.type) {
          if (event.data.type === `CreateWallets`) {
            const walletsData = event.data.walletsData.wallets
            const profileId = event.data.walletsData.profileId
            this.profileId = profileId
            this.walletsData = walletsData

          }
        }
      }
    })
    windowParentPostMessage({
      key: 'CreateWalletsWindow',
      message: {
        type: 'iframeLoaded'
      }
    })
  },
  data(): Data {
    return {
      password: '',
      isCancel: false,
      profileId: '',
      walletsData: []
    }
  },
  methods: {
    createWallets(password): void {
      if (!this.isCancel) {
        this.password = password
        const cInterface = new CryptoInterface()

        
        cInterface.accessProfileByKey(this.profileId, this.password).then(async (profile) => {
          const wallets: Array<unknown> = []
          this.walletsData.forEach(async (walletData, walletIndex) => {
            const network = await cInterface.getNetworkAdaptor(walletData.networkId)
            // @ts-ignore
            const wallet = profile.createWallet(network, walletData.walletNumber)
            wallets.push({
              ...walletData,
              profileId: this.profileId,
              address: wallet.getAddress(),
              publicKey: wallet.getPublicKey()
            })
          })
          windowParentPostMessage({
            key: 'CreateWalletsWindow',
            message: {
              type: 'WalletsCreated',
              wallets
            }
          })
        })
      } else {
        windowParentPostMessage({
          key: 'CreateWalletsWindow',
          message: {
            type: 'CancelCreateWallets'
          }
        })
      }
    },
    cancelCreateWallets(): void {
      this.isCancel = true
    }
  }
})
</script>

<style lang="scss"></style>
