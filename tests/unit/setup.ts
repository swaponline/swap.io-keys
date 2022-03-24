import Vue from 'vue'
import UI from '@/components/UI'
import { enableAutoDestroy } from '@vue/test-utils'

process.env.VUE_APP_HOME_URL = 'http://localhost'
process.env.VUE_APP_KEYS_URL = 'http://keys.localhost'

Vue.use(UI)
enableAutoDestroy(global.afterEach)
