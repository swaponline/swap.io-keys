<template>
  <div id="app" class="theme" :class="classes">
    <media-query-provider :queries="queries">
      <router-view />
    </media-query-provider>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MediaQueryProvider } from 'vue-component-media-queries'
import { getStorage } from '@/utils/storage'
import { getUserSystemTheme } from '@/utils/theme'
import { THEME_KEY, SYSTEM_THEME_KEY } from './constants/theme'
import { messageHandler } from './messageHandler'

interface Queries {
  desktop: string
  tablet: string
  phone: string
  smallPhone: string
}

const queries: Queries = {
  desktop: '(min-width: 1065px)',
  tablet: '(max-width: 1064px)',
  phone: '(max-width: 480px)',
  smallPhone: '(max-width: 320px)'
}

type Theme = 'light' | 'dark' | 'system' | null
type Data = {
  queries: Queries
  selectedAppTheme: Theme
}

export default Vue.extend({
  name: 'App',
  components: {
    MediaQueryProvider
  },
  data(): Data {
    return {
      queries,
      selectedAppTheme: null
    }
  },
  computed: {
    classes() {
      return `theme--${this.selectedAppTheme}`
    }
  },
  async mounted() {
    await messageHandler()
    this.setAppTheme()
  },
  methods: {
    setAppTheme() {
      this.selectedAppTheme = getStorage(THEME_KEY) || SYSTEM_THEME_KEY

      if (this.selectedAppTheme === SYSTEM_THEME_KEY) {
        this.selectedAppTheme = getUserSystemTheme()
      }
    }
  }
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
