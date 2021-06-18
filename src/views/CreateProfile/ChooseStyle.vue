<template>
  <match-media v-slot="{ desktop, tablet }">
    <div class="choose-style">
      <div class="choose-style__inner">
        <header class="choose-style__header">
          <h1 class="choose-style__title">Choose style</h1>
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
            <span
              v-if="desktop && userColorTheme === cardColor"
              class="choose-style__card-text"
              :style="`color: ${cardColor.color}`"
              >Complementary text
            </span>
          </div>
        </div>
        <span
          v-if="tablet"
          :class="['choose-style__text', userColorTheme.color && 'choose-style__text--selected']"
          :style="`color: ${userColorTheme.color}`"
          >Complementary text
        </span>
        <div class="choose-style__buttons">
          <swap-button
            class="choose-style__button"
            :disabled="isDisabledCreateProfile"
            :tooltip="isDisabledCreateProfile ? 'Please pick a color scheme to proceed.' : null"
            @click="goToSecretPhrase"
          >
            Create
          </swap-button>
          <swap-button class="choose-style__button choose-style__button--text" text @click="refreshColors">
            Refresh colors
          </swap-button>
        </div>
      </div>
    </div>
  </match-media>
</template>

<script lang="ts">
import { MatchMedia } from 'vue-component-media-queries'
import Vue from 'vue'
import { generateMnemonic, mnemonicToSeed } from 'bip39'
import { getPublicKey } from '@/utils/chifer'
import windowParentPostMessage from '@/windowParentPostMessage'
import { INIT_IFRAME, SET_BACKGROUND } from '@/constants/createProfile'
import { getUserColorTheme } from '@/utils/getUserColorTheme'
import { CREATE_PROFILE } from '@/constants/windowKey'
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
  components: {
    MatchMedia
  },
  data(): Data {
    return {
      userColorTheme: {
        background: '',
        color: '',
        wordList: []
      } as UserColorTheme,
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
    await this.getMnemonic()
    this.getCards()
    window.addEventListener('resize', this.setCardsBackground)

    windowParentPostMessage({
      key: CREATE_PROFILE,
      message: {
        type: INIT_IFRAME,
        payload: {
          loading: false
        }
      }
    })
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
        selectionColor: string
        wordList: string[]
      }
      const list: listItem[] = []
      for (let i = 0; i < this.publicKeys.length; i += 1) {
        const { background, color, selectionColor } = getUserColorTheme(this.publicKeys[i])

        list.splice(i, 1, {
          background,
          color,
          selectionColor,
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
            userColorTheme: { ...this.userColorTheme, isSelecting: true }
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
  height: 100%;

  &__inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 40px 77px 30px;

    @include tablet {
      padding: 24px 20px;
      align-items: center;
      min-height: auto;
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
    margin: 75px 0 20px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    @include tablet {
      margin: 30px 0 60px;
    }

    @include phone {
      margin: 40px 0 10px;
    }

    @include small-phone {
      margin-top: 10px;
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
    display: flex;
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

  &__card-text,
  &__text {
    width: 100%;
    font-weight: $--font-weight-semi-bold;
    font-size: $--font-size-extra-small-subtitle;
    text-align: center;

    @include tablet {
      font-size: $--font-size-medium;
    }
  }

  &__card-text {
    display: block;
    margin-top: 22px;
  }

  &__text {
    opacity: 0;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.6, 1);

    &--selected {
      opacity: 1;
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

    @include small-phone {
      margin-top: 20px;
    }
  }

  &__button {
    max-width: 174px;

    &:not(:last-child) {
      margin-bottom: 10px;
    }

    &--text {
      color: $--dark-grey;
    }

    @include tablet {
      max-width: 400px;
    }

    @include phone {
      width: 100%;
    }
  }
}
</style>
