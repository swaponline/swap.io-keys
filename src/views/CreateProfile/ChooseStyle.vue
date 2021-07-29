<template>
  <match-media v-slot="{ tablet }" wrapper-tag="div" class="choose-style">
    <div class="choose-style__wrapper">
      <header class="choose-style__header">
        <h1 class="choose-style__title">Choose style</h1>
        <span class="choose-style__subtitle">it cannot be changed later</span>
      </header>
      <div class="choose-style__cards">
        <choose-style-card
          v-for="({ colorScheme }, index) in userThemes"
          :key="index"
          :color-scheme="colorScheme"
          :is-selected-scheme="isSelectedColorScheme(colorScheme)"
          @select="select(index)"
        />
      </div>
      <span v-if="tablet" :class="['choose-style__text', selectedColorScheme.color && 'choose-style__text--selected']"
        >Complementary text
      </span>
      <div class="choose-style__buttons">
        <swap-button
          class="choose-style__button"
          :disabled="!isThemeSelected"
          :tooltip="!isThemeSelected ? 'Please pick a color scheme to proceed.' : null"
          @click="goToSecretPhrase"
        >
          Create
        </swap-button>
        <swap-button class="choose-style__button" text @click="refreshColors">
          Refresh colors
        </swap-button>
      </div>
    </div>
  </match-media>
</template>

<script lang="ts">
import { MatchMedia } from 'vue-component-media-queries'
import Vue from 'vue'
import ChooseStyleCard from '@/components/ChooseStyle/Card.vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import { getUserTheme } from '@/utils/userTheme'
import { UserTheme } from '@/types/userTheme'
import { ColorScheme } from '@/types/generators'
import { CREATE_PROFILE_WINDOW } from '@/constants/windowKey'
import { IFRAME_INITED, THEME_SELECTED, CANCELED } from '@/constants/createProfile'
import { ESCAPE } from '@/constants/keyCodes'

type IndexOfSelectedTheme = number
type Data = {
  userThemes: Array<UserTheme>

  selectedTheme: UserTheme

  isRefreshing: boolean
}

const QUANTITY_CARDS = 4

export default Vue.extend({
  name: 'ChooseStyle',
  components: {
    MatchMedia,
    ChooseStyleCard
  },
  data(): Data {
    return {
      userThemes: [],
      selectedTheme: {
        colorScheme: {
          background: '',
          color: '',
          selectionColor: ''
        },
        wordList: [],
        publicKey: null,
        seed: null
      },
      isRefreshing: false
    }
  },
  computed: {
    selectedColorScheme(): ColorScheme {
      return this.selectedTheme.colorScheme as ColorScheme
    },
    isThemeSelected(): boolean {
      return !!this.selectedColorScheme.background
    }
  },
  async mounted(): Promise<void> {
    document.addEventListener('keydown', this.closeByPressingESC)

    await this.getCards()

    windowParentPostMessage({
      key: CREATE_PROFILE_WINDOW,
      message: {
        type: IFRAME_INITED
      }
    })
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.closeByPressingESC)
  },
  methods: {
    closeByPressingESC({ key }) {
      if (key === ESCAPE) {
        windowParentPostMessage({
          key: CREATE_PROFILE_WINDOW,
          message: {
            type: CANCELED
          }
        })
      }
    },
    isSelectedColorScheme(colorScheme: ColorScheme) {
      return this.selectedColorScheme === colorScheme
    },
    select(selectedIndex: IndexOfSelectedTheme): void {
      this.selectedTheme = this.userThemes.find((_: UserTheme, index: number) => index === selectedIndex)

      document.documentElement.style.setProperty('--main-color', this.selectedColorScheme.color)
      document.documentElement.style.setProperty('--selection-color', this.selectedColorScheme.selectionColor)

      windowParentPostMessage({
        key: CREATE_PROFILE_WINDOW,
        message: {
          type: THEME_SELECTED,
          payload: {
            theme: this.selectedColorScheme
          }
        }
      })
    },

    goToSecretPhrase(): void {
      if (this.selectedTheme.wordList.length > 0) {
        this.$router.push({ name: 'SecretPhrase', params: { theme: this.selectedTheme } })
      }
    },

    async getCards(): Promise<void> {
      const userThemeResolvers: Promise<UserTheme>[] = []

      for (let i = 0; i < QUANTITY_CARDS; i += 1) {
        const userTheme: Promise<UserTheme> = getUserTheme()
        userThemeResolvers.push(userTheme)
      }

      this.userThemes = await Promise.all(userThemeResolvers)
    },

    async refreshColors(): Promise<void> {
      if (!this.isRefreshing) {
        this.isRefreshing = true
        await this.getCards()
        this.isRefreshing = false
      }
    }
  }
})
</script>

<style lang="scss">
.choose-style {
  height: 100%;

  &__wrapper {
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

  &__text {
    width: 100%;
    color: var(--main-color);
    font-weight: $--font-weight-semi-bold;
    font-size: $--font-size-extra-small-subtitle;
    text-align: center;
    opacity: 0;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.6, 1);

    &--selected {
      opacity: 1;
    }

    @include tablet {
      font-size: $--font-size-medium;
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

    @include tablet {
      max-width: 400px;
    }

    @include phone {
      width: 100%;
    }
  }
}
</style>
