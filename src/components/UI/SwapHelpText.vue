<template>
  <match-media v-slot="{ phone }" wrapper-tag="div">
    <div class="swap-help-text">
      <template v-if="!phone">
        <slot></slot>
      </template>
      <swap-button v-else v-close-popover :tooltip="text" class="swap-help-text__button" round>
        ?
      </swap-button>
    </div>
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
    height: 23px;
    padding: 0;
  }
}
</style>
