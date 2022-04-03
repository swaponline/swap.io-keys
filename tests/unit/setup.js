import Vue from 'vue'
import UI from '@/components/UI'
import { enableAutoDestroy } from '@vue/test-utils'

Vue.use(UI)
enableAutoDestroy(global.afterEach)
