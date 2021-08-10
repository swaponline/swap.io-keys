<template>
  <div>
    <div>CREATE WALLET POPUP FRAME</div>
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
            console.log('>>>>> CreateWallets action', profileId, walletsData)
            this.profileId = profileId
            this.walletsData = walletsData

          }
        }
      }
    })
    windowParentPostMessage({
      key: 'CreateWalletsWindow',
      message: {
        type: 'iframeInited'
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
        console.log('>>>>> create wallet - password submited', this.password, this.isCancel, this.walletData)
        const cInterface = new CryptoInterface()

        
        cInterface.accessProfileByKey(this.profileId, this.password).then(async (profile) => {
          const wallets: Array<unknown> = []
          console.log('Accesed profile', profile)
          this.walletsData.forEach(async (walletData, walletIndex) => {
            const network = await cInterface.getNetworkAdaptor(walletData.networkId)
            console.log('>>>> network', network)
            // @ts-ignore
            const wallet = profile.createWallet(network, walletData.walletNumber)
            wallets.push({
              ...walletData,
              profileId: this.profileId,
              address: wallet.getAddress(),
              publicKey: wallet.getPublicKey()
            })
          })
          console.log('wallets', wallets)
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
