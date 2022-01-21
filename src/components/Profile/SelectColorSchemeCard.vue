<template>
  <div :class="['select-style-card', isSelected && 'select-style-card--select']" @click="select">
    <canvas ref="backgroundCanvas" class="select-style-card__background"></canvas>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Canvg from 'canvg'
import { ColorScheme } from '@/types/generators'

let canvg: any = null

export default Vue.extend({
  name: 'SelectColorSchemeCard',
  props: {
    colorScheme: {
      type: Object as PropType<ColorScheme>,
      default: () => {
        return {} as ColorScheme
      }
    },
    isSelected: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  watch: {
    colorScheme: {
      immediate: true,
      handler() {
        this.$nextTick(() => this.setCardBackground())
      }
    }
  },

  mounted() {
    window.addEventListener('resize', this.setCardBackground)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setCardBackground)
  },
  methods: {
    select() {
      this.$emit('select')
    },
    setCardBackground(): void {
      const { background } = this.colorScheme
      const canvas = this.$refs.backgroundCanvas
      const ctx = canvas.getContext('2d')

      const options = {
        ignoreMouse: true,
        ignoreAnimation: true
      }

      // hack for scaling svg to canvas size
      canvas.style = ''
      const widthStr = `width="${canvas.offsetWidth}"\n`
      const heightStr = `height="${canvas.offsetHeight}"\n`

      const index = background.indexOf('viewBox')
      const resSvg = background.substring(0, index) + widthStr + heightStr + background.substring(index)
      if (canvg) this.resetCanvg()

      canvg = Canvg.fromString(ctx, resSvg, options)

      canvas.style.display = 'block'
      canvg.start()
    },
    resetCanvg() {
      canvg.stop()
      canvg = null
    }
  }
})
</script>

<style lang="scss">
.select-style-card {
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
