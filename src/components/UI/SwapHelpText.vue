<template>
  <match-media v-slot="{ phone }" wrapper-tag="div" class="swap-help-text">
    <template v-if="!phone">
      <slot></slot>
    </template>
    <swap-button v-if="phone" v-close-popover class="swap-help-text__button" round :tooltip="text">
      ?
    </swap-button>
  </match-media>
</template>

<script lang="ts">
import { MatchMedia } from 'vue-component-media-queries'
import Vue from 'vue'

export default Vue.extend({
  name: 'SwapHelText',
  components: {
    MatchMedia
  },
  computed: {
    text() {
      return this.$slots.default[0].text
    }
  }
})
</script>

<style lang="scss">
.swap-help-text {
  color: $--grey-3;
  font-size: $--font-size-medium;

  &__button {
    width: 23px;
    min-height: 23px;
  }
}
</style>
