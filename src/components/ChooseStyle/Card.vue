<template>
  <match-media v-slot="{ desktop }" class="choose-style-card" wrapper-tag="div">
    <div
      :class="['choose-style-card__wrapper', isSelectedScheme && 'choose-style-card__wrapper--select']"
      @click="select"
    >
      <canvas ref="backgroundCanvas" class="choose-style-card__background"></canvas>
    </div>
    <span v-if="desktop && isSelectedScheme" class="choose-style-card__text">Complementary text </span>
  </match-media>
</template>

<script lang="ts">
import { MatchMedia } from 'vue-component-media-queries'
import Vue, { PropType } from 'vue'
import Canvg from 'canvg'
import { ColorScheme } from '@/types/generators'

export default Vue.extend({
  name: 'ChooseStyleCard',
  components: {
    MatchMedia
  },
  props: {
    colorScheme: {
      type: Object as PropType<ColorScheme>,
      default: () => {
        return {} as ColorScheme
      }
    },
    isSelectedScheme: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  watch: {
    colorScheme: {
      immediate: true,
      handler() {
        this.$nextTick(() => this.setCardsBackground())
      }
    }
  },

  mounted() {
    window.addEventListener('resize', this.setCardsBackground)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setCardsBackground)
  },
  methods: {
    select() {
      this.$emit('select')
    },
    setCardsBackground(): void {
      const canvas = this.$refs.backgroundCanvas
      const ctx = canvas.getContext('2d')

      const options = {
        ignoreMouse: true,
        ignoreAnimation: true
      }
      const { background } = this.colorScheme
      // hack for scaling svg to canvas size
      canvas.style = ''
      const widthStr = `width="${canvas.offsetWidth}"\n`
      const heightStr = `height="${canvas.offsetHeight}"\n`
      const index = background.indexOf('viewBox')
      const resSvg = background.substring(0, index) + widthStr + heightStr + background.substring(index)

      const canvg = Canvg.fromString(ctx, resSvg, options)

      canvg.start()
    }
  }
})
</script>

<style lang="scss">
.choose-style-card {
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

  &__wrapper {
    display: flex;
    padding: 5px 5px;
    border-radius: 20px;
    border: 5px solid transparent;
    cursor: pointer;

    &--select {
      border-color: $--grey;
    }
  }

  &__background {
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

  &__text {
    display: block;
    margin-top: 22px;
    color: var(--main-color);
    width: 100%;
    font-weight: $--font-weight-semi-bold;
    font-size: $--font-size-extra-small-subtitle;
    text-align: center;

    @include tablet {
      font-size: $--font-size-medium;
    }
  }
}
</style>
