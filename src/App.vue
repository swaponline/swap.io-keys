<template>
  <div id="app">
    <media-query-provider :queries="queries">
      <router-view />
    </media-query-provider>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MediaQueryProvider } from 'vue-component-media-queries'

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

type Data = {
  queries: Queries
}

export default Vue.extend({
  name: 'App',
  components: {
    MediaQueryProvider
  },
  data(): Data {
    return {
      queries
    }
  }
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
