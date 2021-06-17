<template>
  <div class="show-secret-phrase">
    <header class="show-secret-phrase__header">
      <button class="show-secret-phrase__back-button" @click="back">
        <span>
          <svg-icon class="show-secret-phrase__icon-back" name="i_back"></svg-icon>
        </span>
      </button>
      <h1 class="show-secret-phrase__title">Your secret phrase</h1>
    </header>
    <div class="show-secret-phrase__words">
      <span v-for="(word, i) in words" :key="word + i" class="show-secret-phrase__word"> {{ i + 1 }}. {{ word }} </span>
    </div>
    <div class="show-secret-phrase__buttons">
      <swap-button class="show-secret-phrase__button show-secret-phrase__button--hide-tablet" @click="back">
        Back
      </swap-button>
      <swap-button class="show-secret-phrase__button" @click="$emit('next')">Next</swap-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type Data = {
  value: string
}

export default Vue.extend({
  name: 'ShowSecretPhrase',
  props: {
    words: {
      type: Array as PropType<string[]>,
      default: (): string[] => {
        return []
      }
    }
  },
  data(): Data {
    return {
      value: ''
    }
  },
  methods: {
    back(): void {
      this.$router.push({ name: 'ChooseStyle' })
    }
  }
})
</script>

<style lang="scss">
.show-secret-phrase {
  height: 100%;
  padding: 40px 50px 60px;
  display: flex;
  flex-direction: column;

  @include tablet {
    padding: 20px 20px;
  }

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-weight: $--font-weight-semi-bold;
    font-size: $--font-size-extra-title;
    text-align: center;
    width: 100%;

    @include tablet {
      font-size: $--font-size-subtitle;
    }
  }

  &__back-button {
    width: 44px;
    height: 44px;
    margin-left: -17px;
    display: none;
    position: relative;

    & > span {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-radius: 50%;
      opacity: 0;
      background-color: $--light-grey;
      transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);
    }

    &:hover {
      &::before {
        opacity: 1;
      }
    }

    @include tablet {
      display: block;
      flex: 1 0 auto;
    }
  }

  &__icon-back {
    width: 24px;
    height: 24px;
    z-index: 100;
  }

  &__words {
    margin: 30px 0 20px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    @include tablet {
      margin-top: 0;
    }
  }

  &__word {
    width: calc(100% / 6);
    font-size: $--font-size-extra-small-subtitle;
    margin-top: 30px;
    border-bottom: 1px solid transparent;

    @include tablet {
      margin-top: 20px;
      width: calc(100% / 3);
    }

    @include phone {
      font-size: $--font-size-medium;
    }

    @include small-phone {
      font-size: $--font-size-base;
    }
  }

  &__buttons {
    margin-top: auto;
    display: flex;
    justify-content: center;

    @include tablet {
      flex-wrap: wrap-reverse;
    }
  }

  &__button {
    max-width: 174px;

    &:not(:last-child) {
      margin-right: 12px;
    }

    @include tablet {
      width: 100%;
      max-width: 334px;

      &--hide-tablet {
        display: none;
      }
    }
  }
}
</style>
