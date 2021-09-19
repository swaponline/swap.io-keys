<template>
  <div class="choose-style">
    <header-profile class="choose-style__header">
      Pick your colors
      <template #help-text>
        <swap-help-text class="choose-style__help-text">
          Your own colors will protect you from phishing. Each profile has unique color scheme. Take the time to pick
          the profile with colors of your choice.
        </swap-help-text>
      </template>
    </header-profile>
    <choose-style-cards class="choose-style__cards">
      <template #default="{ userThemes }">
        <choose-style-card
          v-for="(userTheme, index) in userThemes"
          :key="index"
          :color-scheme="userTheme.colorScheme"
          :is-selected-scheme="isSelectedColorScheme(userTheme.colorScheme)"
          @select="installingTheme(userTheme)"
        />
      </template>
      <template #actions="{ refreshColors }">
        <div class="choose-style__refresh-button-wrapper">
          <swap-button class="choose-style__refresh-button" @click="refreshColors">
            <svg-icon aria-label="Refresh colors" class="choose-style__refresh-icon" name="i_refresh" />
            Refresh colors
          </swap-button>
        </div>
      </template>
    </choose-style-cards>

    <div class="choose-style__buttons">
      <swap-button class="choose-style__button" @click="back">
        Back
      </swap-button>
      <swap-button
        class="choose-style__button"
        :disabled="!isThemeSelected"
        :tooltip="!isThemeSelected ? 'Please pick a color scheme to proceed.' : null"
        @click="goToSecretPhrase"
      >
        Next
      </swap-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HeaderProfile from '@/components/CreateProfile/Header.vue'
import ChooseStyleCards from '@/components/CreateProfile/ChooseStyle/Cards.vue'
import ChooseStyleCard from '@/components/CreateProfile/ChooseStyle/Card.vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import { UserTheme } from '@/types/userTheme'
import { ColorScheme } from '@/types/generators'
import { CREATE_PROFILE_WINDOW } from '@/constants/windowKey'
import { THEME_SELECTED, CANCELED } from '@/constants/createProfile'
import { ESCAPE } from '@/constants/keyCodes'
import { setCSSCustomProperty } from '@/utils/common'
import { getStorage } from '@/utils/storage'
import { THEME_KEY, DARK_THEME_KEY } from '@/constants/theme'

type Data = {
  selectedTheme: UserTheme

  isRefreshing: boolean
}

export default Vue.extend({
  name: 'ChooseStyle',
  components: {
    HeaderProfile,
    ChooseStyleCards,
    ChooseStyleCard
  },
  data(): Data {
    return {
      selectedTheme: {
        colorScheme: {
          background: '',
          color: '',
          colorForDarkTheme: '',
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
  mounted(): void {
    document.addEventListener('keydown', this.closeByPressingESC)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.closeByPressingESC)
  },
  methods: {
    back() {
      windowParentPostMessage({
        key: CREATE_PROFILE_WINDOW,
        message: {
          type: CANCELED
        }
      })
    },
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

    setCustomColorCSSVariables(): void {
      if (getStorage(THEME_KEY) === DARK_THEME_KEY) {
        setCSSCustomProperty('main-color', this.selectedColorScheme.colorForDarkTheme)
      } else {
        setCSSCustomProperty('main-color', this.selectedColorScheme.color)
      }

      setCSSCustomProperty('selection-color', this.selectedColorScheme.selectionColor)
    },

    installingTheme(selectedUserTheme: ColorScheme): void {
      this.selectedTheme = selectedUserTheme

      this.setCustomColorCSSVariables()

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
    }
  }
})
</script>

<style lang="scss">
.tooltip {
  .tooltip-inner {
    background: $--purple;
    padding: 12px 14px;
    border-radius: 12px;
    width: 264px;
    font-size: 15px;
  }

  .tooltip-arrow {
    border-color: $--purple;
  }
}

.choose-style {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px 110px 40px;

  @include tablet {
    align-items: center;
    min-height: auto;
    padding: 30px 25px 25px;
  }

  @include phone {
    padding: 28px 0 20px;
  }

  &__header {
    margin-bottom: 44px;

    @include tablet {
      margin-bottom: 75px;
    }

    @include phone {
      margin-bottom: 50px;
    }

    @include small-phone {
      margin-bottom: 0;
    }
  }

  &__help-text {
    max-width: 462px;
  }

  &__refresh-button-wrapper {
    display: flex;
    justify-content: center;
  }

  &__refresh-icon {
    width: 14px;
    height: 14px;
    margin-right: 9px;
    fill: var(--main-icon-color);
    transition: $--transition-duration;
  }

  &__refresh-button {
    max-width: 135px;
    min-height: 31px;
    border-radius: 4px;
    padding: 6px 10px 6px 10px;

    .swap-button__content {
      font-size: $--font-size-base;
      font-weight: $--font-weight-semi-bold;
      letter-spacing: initial;
      display: flex;
    }
  }

  &__buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: auto;

    @include tablet {
      margin: auto auto 0;
      max-width: 400px;
    }

    @include phone {
      max-width: 314px;
    }

    @include small-phone {
      max-width: 260px;
    }
  }

  &__button {
    max-width: 174px;
    min-height: 45px;

    .swap-button__content {
      font-weight: $--font-weight-semi-bold;
    }

    &:not(:last-child) {
      margin-right: 10px;
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
