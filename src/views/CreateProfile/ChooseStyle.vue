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
            :class="{ 'choose-style__card-inner--select': selectGradient === cardColor }"
            @click="select(cardColor)"
          >
            <div class="choose-style__card-background" :style="`background-image: ${cardColor.background}`"></div>
          </div>
          <span v-if="selectGradient === cardColor" class="choose-style__card-text" :style="`color: ${cardColor.color}`"
            >Complementary text
          </span>
        </div>
      </div>
      <span v-if="selectGradient.color" class="choose-style__text" :style="`color: ${selectGradient.color}`"
        >Complementary text
      </span>
      <div class="choose-style__buttons">
        <swap-button class="choose-style__button" :disabled="!isDisabledCreateProfile" @click="goToSecretPhrase"
          >Create</swap-button
        >
        <swap-button class="choose-style__button choose-style__button--text" text @click="refreshColors">
          Refresh colors
        </swap-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { generateMnemonic, mnemonicToSeed } from 'bip39'
import { getPublicKey } from '@/utils/chifer'
import windowParentPostMessage from '@/windowParentPostMessage'
import { INIT_IFRAME, SET_BACKGROUND } from '@/constants/createProfile'
import { getUserColorTheme } from '@/utils/getUserColorTheme'
import { CREATE_PROFILE } from '@/constants/windowKey'
import mnemonic from './mnemonic'

const QUANTITY_CARDS = 4

export default {
  name: 'ChooseStyle',
  data() {
    return {
      selectGradient: {
        background: null,
        color: null,
        wordList: []
      },
      cardColors: [],
      publicKeys: []
    }
  },
  computed: {
    isDisabledCreateProfile() {
      return !!this.selectGradient.wordList.length
    }
  },
  async mounted() {
    windowParentPostMessage({
      key: CREATE_PROFILE,
      message: {
        type: INIT_IFRAME,
        loading: false
      }
    })
    await this.getMnemonic()
    this.getCards()
  },
  methods: {
    select(color) {
      this.selectGradient = color
      this.setBackground()
    },

    goToSecretPhrase() {
      if (this.selectGradient.wordList.length > 0) {
        this.$router.push({ name: 'SecretPhrase' })
      }
    },

    async getMnemonic() {
      const seedsResolvers: Promise<Buffer>[] = []
      for (let i = 0; i < QUANTITY_CARDS; i += 1) {
        this.selectGradient.wordList = generateMnemonic(256).split(' ')
        const seed = mnemonicToSeed(this.selectGradient.wordList.join(' '))
        seedsResolvers.push(seed)
      }
      const seeds = await Promise.all(seedsResolvers)

      seeds.forEach(seed => {
        const publicKey = getPublicKey(seed)
        this.publicKeys.push(publicKey)
      })
    },

    getCards() {
      type listItem = {
        background: string
        color: string
        wordList: string[]
      }
      const list: listItem[] = []
      for (let i = 0; i < this.publicKeys.length; i += 1) {
        const { background, color } = getUserColorTheme(this.publicKeys[i])

        list.splice(i, 1, {
          background,
          color,
          wordList: this.selectGradient.wordList
        })
      }

      this.cardColors = list
    },

    async refreshColors() {
      this.selectGradient = {
        background: null,
        color: null,
        wordList: []
      }
      this.publicKeys = []
      await this.getMnemonic()
      this.getCards()
    },

    setBackground() {
      windowParentPostMessage({
        key: CREATE_PROFILE,
        message: {
          type: SET_BACKGROUND,
          selectGradient: this.selectGradient
        }
      })
      mnemonic.card = this.selectGradient
    }
  }
}
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
