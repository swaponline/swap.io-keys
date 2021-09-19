<template>
  <div :class="['choose-style-card', isSelectedScheme && 'choose-style-card--select']" @click="select">
    <canvas ref="backgroundCanvas" class="choose-style-card__background"></canvas>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Canvg from 'canvg'
import { ColorScheme } from '@/types/generators'

export default Vue.extend({
  name: 'ChooseStyleCard',
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
      this.$emit('select', this.colorScheme)
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
  display: flex;
  cursor: pointer;
  padding: 5px 5px;
  border-radius: 20px;
  border: 5px solid transparent;

  @include phone {
    width: 150px;
  }

  @include small-phone {
    width: 130px;
  }

  &--select {
    border-color: var(--main-color);
  }

  &__background {
    background-size: 100% 100%;
    width: 100%;
    height: 120px;
    border-radius: 12px;

    @include tablet {
      height: 145px;
    }

    @include phone {
      height: 100px;
    }
  }
}
</style>
