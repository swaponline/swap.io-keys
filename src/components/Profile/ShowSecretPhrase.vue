<template>
  <div class="show-secret-phrase">
    <header class="show-secret-phrase__header">
      <button class="show-secret-phrase__back-button" @click="back">
        <svg-icon class="show-secret-phrase__icon-back" name="i_back"></svg-icon>
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
  position: relative;
  height: 100%;
  min-height: 555px;
  width: 100%;
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
    width: 24px;
    height: 24px;
    margin-left: -5px;
    display: none;

    @include tablet {
      display: block;
    }
  }

  &__icon-back {
    width: inherit;
    height: inherit;
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

    @include small {
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
    margin: 0 5px;
    min-width: 174px !important;

    @include tablet {
      width: 100%;
      margin-bottom: 10px;

      &--hide-tablet {
        display: none;
      }
    }
  }
}
</style>
