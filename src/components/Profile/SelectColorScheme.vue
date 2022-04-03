<template>
  <div class="select-color-scheme">
    <header-profile class="select-color-scheme__header">
      Pick your colors
      <template #help-text>
        <swap-help-text class="select-color-scheme__help-text">
          Your own colors will protect you from phishing. Each profile has unique color scheme. Take the time to pick
          the profile with colors of your choice.
        </swap-help-text>
      </template>
    </header-profile>
    <div class="select-color-scheme__cards">
      <select-color-scheme-card
        v-for="(colorScheme, index) in options"
        :key="index"
        :color-scheme="colorScheme"
        :is-selected="isSelectedScheme(colorScheme)"
        @select="selectColorScheme(colorScheme)"
      />
    </div>
    <div class="select-color-scheme__cards-actions">
      <swap-button class="select-color-scheme__refresh-button" @click="refreshColorSchemes">
        <svg-icon aria-label="Refresh colors" class="select-color-scheme__refresh-icon" name="i_refresh" />
        Refresh colors
      </swap-button>
    </div>
    <slot name="actions"></slot>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import HeaderProfile from '@/components/Profile/Header.vue'
import SelectColorSchemeCard from '@/components/Profile/SelectColorSchemeCard.vue'
import { ColorScheme } from '@/types/services/userColorSchemeService'

export default Vue.extend({
  name: 'SelectColorScheme',
  components: {
    HeaderProfile,
    SelectColorSchemeCard
  },
  props: {
    options: {
      type: Array as PropType<ColorScheme[]>,
      default: () => {
        return []
      }
    },
    selectedColorScheme: {
      type: Object as PropType<ColorScheme>,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    localSelectedColorScheme: {
      get() {
        return this.selectedColorScheme
      },
      set(newSelectedColorScheme) {
        this.$emit('update:selected-color-scheme', newSelectedColorScheme)
      }
    }
  },
  methods: {
    isSelectedScheme(colorScheme: ColorScheme): boolean {
      return this.localSelectedColorScheme.color === colorScheme.color
    },
    refreshColorSchemes(): void {
      this.$emit('refresh-color-schemes')
    },
    selectColorScheme(selectedColorScheme: ColorScheme): void {
      this.localSelectedColorScheme = selectedColorScheme
      this.$emit('select-color-scheme')
    }
  }
})
</script>

<style lang="scss">
.select-color-scheme {
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
    padding: 28px 20px 20px;
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
      margin-bottom: 10px;
    }
  }

  &__help-text {
    max-width: 462px;
  }

  &__cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    width: 100%;
    margin-bottom: 40px;

    @include tablet {
      grid-template-columns: 1fr 1fr;
    }

    &-actions {
      display: flex;
      justify-content: center;
    }
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
    height: 31px;
    border-radius: 4px;
    padding: 6px 10px 6px 10px;

    .swap-button__content {
      font-size: $--font-size-base;
      font-weight: $--font-weight-semi-bold;
      letter-spacing: initial;
      display: flex;
    }
  }
}
</style>
