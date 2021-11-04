<template>
  <div>
    <enter-password :is-cancel="isCancel" :password="password" @close="cancelCreateWallet" @submit="createWallet" />
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from 'vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import { getStorage, setStorage } from '@/utils/storage'
import CryptoInterface from '@/crypto/interface'

type Data = {
  password: string
  isCancel: boolean
  walletData: unknown
}

export default Vue.extend({
  name: 'CreateWallet',
  mounted(): void {
    window.addEventListener('message', event => {
      if (event.data && event.data.key && event.data.key === `CreateWalletWindow`) {
        if (event.data && event.data.type) {
          if (event.data.type === `CreateWallet`) {
            const walletData = event.data.walletData
            this.walletData = walletData
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
      isCancel: false,
      walletData: false
    }
  },
  methods: {
    createWallet(password): void {
      new Promise(async (resolve) => {
        if (!this.isCancel) {
          this.password = password
          const cInterface = new CryptoInterface()
          const network = await cInterface.getNetworkAdaptor(this.walletData.networkId)
          cInterface.accessProfileByKey(this.walletData.profileId, this.password).then(async (profile) => {
            const {
              networkId,
              profileId,
            } = this.walletData
            // @ts-ignore
            const wallet = profile.createWallet(network, this.walletData.walletNumber)
            const profileWallets: Record<string, unknown> = getStorage(`wallets_${profileId}`) || {}
            profileWallets[`${networkId}_${wallet.getAddress()}`] = {
              ... this.walletData,
              address: wallet.getAddress(),
              publicKey: wallet.getPublicKey()
            }
            setStorage(`wallets_${profileId}`, profileWallets)

            windowParentPostMessage({
              key: 'CreateWalletWindow',
              message: {
                type: 'WalletCreated',
                wallet: {
                  ... this.walletData,
                  address: wallet.getAddress(),
                  publicKey: wallet.getPublicKey()
                }
              }
            })
          })
        } else {
          windowParentPostMessage({
            key: 'CreateWalletWindow',
            message: {
              type: 'CancelCreateWallet'
            }
          })
        }
        resolve(true)
      })
    },
    cancelCreateWallet(): void {
      this.isCancel = true
    }
  }
})
</script>

<style lang="scss"></style>
