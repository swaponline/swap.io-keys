<template>
  <svg :class="className" xmlns="http://www.w3.org/2000/svg">
    <title v-if="title">
      {{ title }}
    </title>
    <use :xlink:href="iconPath" xmlns:xlink="http://www.w3.org/1999/xlink" />
  </svg>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type Data = {
  icon: Record<string, unknown>
}
export default Vue.extend({
  name: 'SvgIcon',
  props: {
    name: {
      type: String as PropType<string>,
      required: true
    },
    title: {
      type: String as PropType<string>,
      default: null
    }
  },
  data(): Data {
    return {
      icon: {}
    }
  },
  computed: {
    iconPath(): string {
      if (Object.prototype.hasOwnProperty.call(this.icon, 'default')) {
        const icon = this.icon.default
        return `#${icon.id}`
      }
      return `#`
    },
    className(): string {
      return `svg-icon svg-icon--${this.name}`
    }
  },
  watch: {
    name: {
      immediate: true,
      async handler(val) {
        this.icon = await import(`@/assets/icons/${val}.svg`)
      }
    }
  }
})
</script>
