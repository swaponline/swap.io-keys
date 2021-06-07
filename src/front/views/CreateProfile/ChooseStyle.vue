<template>
  <div class="choose-style">
    <div class="choose-style__inner">
      <header class="choose-style__header">
        <h1 class="choose-style__title">Choose title</h1>
        <span class="choose-style__subtitle">it cannot be changed later</span>
      </header>
      <div class="choose-style__cards">
        <div v-for="cardColor in cardColors" :key="cardColor.background" class="choose-style__card">
          <div
            class="choose-style__card-inner"
            :class="{ 'choose-style__card-inner--select': userColorTheme === cardColor }"
            @click="select(cardColor)"
          >
            <canvas ref="backgroundCanvas" class="choose-style__card-background"></canvas>
          </div>
          <span v-if="userColorTheme === cardColor" class="choose-style__card-text" :style="`color: ${cardColor.color}`"
            >Complementary text
          </span>
        </div>
      </div>
      <span v-if="userColorTheme.color" class="choose-style__text" :style="`color: ${userColorTheme.color}`"
        >Complementary text
      </span>
      <div class="choose-style__buttons">
        <div class="choose-style__buttons-control">
          <swap-button class="choose-style__button" @click="cancelCreate">Cancel</swap-button>
          <swap-button
            class="choose-style__button"
            :disabled="isDisabledCreateProfile"
            :tooltip="isDisabledCreateProfile ? 'Please pick a color scheme to proceed.' : null"
            @click="goToSecretPhrase"
          >
            Create
          </swap-button>
        </div>
        <swap-button class="choose-style__button choose-style__button--text" text @click="refreshColors">
          Refresh colors
        </swap-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { generateMnemonic, mnemonicToSeed } from 'bip39'
import { getPublicKey } from '@/front/utils/chifer'
import windowParentPostMessage from '@/front/windowParentPostMessage'
import { INIT_IFRAME, REDIRECT_TO_HOME, SET_BACKGROUND } from '@/front/constants/createProfile'
import { getUserColorTheme } from '@/front/utils/getUserColorTheme'
import { CREATE_PROFILE } from '@/front/constants/windowKey'
import Canvg from 'canvg'
import mnemonic from './mnemonic'

const QUANTITY_CARDS = 4

type UserColorTheme = {
  background: string
  color: string
  wordList: Array<string>
}

type Data = {
  userColorTheme: UserColorTheme
  cardColors: Array<UserColorTheme>
  publicKeys: Array<string>
  isRefreshing: boolean
}

export default Vue.extend({
  name: 'ChooseStyle',
  data(): Data {
    return {
      userColorTheme: {
        background: '',
        color: '',
        wordList: []
      },
      cardColors: [],
      publicKeys: [],
      isRefreshing: false
    }
  },
  computed: {
    isDisabledCreateProfile(): boolean {
      return !this.userColorTheme.background
    }
  },
  async mounted(): Promise<void> {
    windowParentPostMessage({
      key: CREATE_PROFILE,
      message: {
        type: INIT_IFRAME,
        payload: {
          loading: false
        }
      }
    })
    await this.getMnemonic()
    this.getCards()
    window.addEventListener('resize', this.setCardsBackground)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setCardsBackground)
  },
  methods: {
    select(userColorTheme: UserColorTheme): void {
      this.userColorTheme = userColorTheme
      this.setBackground()
    },

    goToSecretPhrase(): void {
      if (this.userColorTheme.wordList.length > 0) {
        this.$router.push({ name: 'SecretPhrase' })
      }
    },

    cancelCreate(): void {
      windowParentPostMessage({
        key: CREATE_PROFILE,
        message: {
          type: REDIRECT_TO_HOME
        }
      })
    },

    async getMnemonic(): Promise<void> {
      const seedsResolvers: Promise<Buffer>[] = []
      for (let i = 0; i < QUANTITY_CARDS; i += 1) {
        this.userColorTheme.wordList = generateMnemonic(256).split(' ')
        const seed = mnemonicToSeed(this.userColorTheme.wordList.join(' '))
        seedsResolvers.push(seed)
      }
      const seeds = await Promise.all(seedsResolvers)

      seeds.forEach(seed => {
        const publicKey = getPublicKey(seed)
        this.publicKeys.push(publicKey)
      })
    },

    getCards(): void {
      type listItem = {
        background: string
        color: string
        colorSelection: string
        wordList: string[]
      }
      const list: listItem[] = []
      for (let i = 0; i < this.publicKeys.length; i += 1) {
        const { background, color, colorSelection } = getUserColorTheme(this.publicKeys[i])

        list.splice(i, 1, {
          background,
          color,
          colorSelection,
          wordList: this.userColorTheme.wordList
        })
      }

      this.cardColors = list
      this.$nextTick(() => this.setCardsBackground())
    },

    setCardsBackground(): void {
      this.cardColors.forEach((color, i) => {
        const canvas = this.$refs.backgroundCanvas[i]
        const ctx = canvas.getContext('2d')
        const options = {
          ignoreMouse: true,
          ignoreAnimation: true
        }

        const { background } = color
        // hack for scaling svg to canvas size
        canvas.style = ''
        const widthStr = `width="${canvas.offsetWidth}"\n`
        const heightStr = `height="${canvas.offsetHeight}"\n`
        const index = background.indexOf('viewBox')
        const resSvg = background.substring(0, index) + widthStr + heightStr + background.substring(index)

        const canvg = Canvg.fromString(ctx, resSvg, options)

        canvg.start()
      })
    },

    async refreshColors(): Promise<void> {
      if (!this.isRefreshing) {
        this.isRefreshing = true
        this.publicKeys = []
        await this.getMnemonic()
        this.getCards()
        this.isRefreshing = false
      }
    },

    setBackground(): void {
      windowParentPostMessage({
        key: CREATE_PROFILE,
        message: {
          type: SET_BACKGROUND,
          payload: {
            userColorTheme: this.userColorTheme
          }
        }
      })
      mnemonic.card = this.userColorTheme
    }
  }
})
</script>

<style lang="scss">
.choose-style {
  width: 100%;
  max-width: 1064px;
  height: 100%;
  max-height: 555px;
  margin: 20px auto;
  background: $--white;
  flex-grow: 1;
  border-radius: 12px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;

  @include tablet {
    width: auto;
    margin: 20px 20px 25px;
    max-height: none;
    max-width: none;
  }

  &__inner {
    position: relative;
    height: 100%;
    min-height: 555px;
    width: 100%;
    padding: 40px 67px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @include tablet {
      padding: 24px 20px;
      align-items: center;
    }
  }

  &__header {
    width: 100%;
    text-align: center;
  }

  &__title {
    font-weight: $--font-weight-semi-bold;
    font-size: $--font-size-extra-title;

    @include tablet {
      width: 100%;
      font-size: $--font-size-subtitle;
    }
  }

  &__subtitle {
    margin-top: 10px;
    color: $--grey-3;
    font-weight: $--font-weight-semi-bold;
    font-size: $--font-size-medium;

    @include tablet {
      width: 100%;
      text-align: left;
      font-size: $--font-size-medium;
    }
  }

  &__cards {
    margin: 75px -7px 20px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    @include tablet {
      margin: 30px -7px 60px;
    }

    @include phone {
      margin: 30px -2px 10px;
    }
  }

  &__card {
    width: calc(25% - 14px);
    margin: 0 7px;

    @include tablet {
      width: calc(50% - 14px);
      margin: 9px 7px;
    }

    @include phone {
      width: calc(50% - 4px);
      margin: 2px;
    }
  }

  &__card-inner {
    padding: 5px 5px;
    border-radius: 20px;
    border: 5px solid transparent;
    cursor: pointer;

    &--select {
      border-color: $--grey;
    }
  }

  &__card-background {
    background-size: 100% 100%;
    border-radius: 12px;
    width: 100%;
    height: 120px;

    @include tablet {
      height: 145px;
    }

    @include phone {
      height: 100px;
    }
  }

  &__card-text {
    display: block;
    margin-top: 22px;
    width: 100%;
    text-align: center;
    font-weight: $--font-weight-semi-bold;
    font-size: $--font-size-extra-small-subtitle;

    @include tablet {
      display: none;
    }
  }

  &__text {
    display: none;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
    font-weight: $--font-weight-semi-bold;
    font-size: $--font-size-extra-small-subtitle;

    @include tablet {
      display: block;
    }

    @include phone {
      margin-top: auto;
    }
  }

  &__buttons {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    @include tablet {
      margin: auto auto 0;
      max-width: 400px;
    }

    @include phone {
      margin-top: 30px;
    }
  }

  .buttons-control {
    display: flex;
  }

  &__button {
    margin: 0 5px;
    min-width: 174px !important;

    &--text {
      margin-top: 10px;
      color: $--dark-grey !important;
    }

    @include tablet {
      margin-bottom: 10px;
    }
  }

  &__iframe {
    position: absolute;
    clip: rect(0 0 0 0);
    width: 1px;
    height: 1px;
    margin: -1px;
  }
}
</style>
