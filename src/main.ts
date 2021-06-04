import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import { FIREFOX } from '@/constants/browsers'
import UaParser from 'ua-parser-js'
import VTooltip from 'v-tooltip'
import App from './App.vue'
import router from './router'
import store from './store'
import messageHandler from './messageHandler'
import windowParentPostMessage from './windowParentPostMessage'
import UI from './components/UI'
import '@/assets/scss/base.scss'

Vue.use(VTooltip)
Vue.use(UI)
// Vue.config.productionTip = false
const uaParser = new UaParser()
const { name: browserName } = uaParser.getBrowser()
let shouldCreateIframe = false

function checkingIframeAndDomain(location: string): boolean {
  /* 
    process.env.VUE_APP_HOME_URL - это что? белый список, для которого разрешаем использовать библиотеку?
      или домен, на котором разрешена работа библиотеки (https://keys.swap.io)
      Если второе, то это не работает (location = адрес сайта, на котором размешен iframe)
      Временно выключил эту проверку
  */
  return window.top !== window.self // && location === process.env.VUE_APP_HOME_URL
}

messageHandler()
windowParentPostMessage({ key: 'createWindow' })

console.log('>>>>>', process.env.VUE_APP_HOME_URL)
if (browserName === FIREFOX) {
  shouldCreateIframe = checkingIframeAndDomain(document.referrer.substring(0, document.referrer.length - 1))
} else {
  shouldCreateIframe = checkingIframeAndDomain(window.location.ancestorOrigins[0])
}

// Не разрешаем обычное открытие, только в iframe и только на определенном домене
if (shouldCreateIframe) {
  /* eslint-disable vue/require-name-property */
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
} else {
  console.warn('>> Not in iframe', window.location.ancestorOrigins[0], process.env.VUE_APP_HOME_URL)
}
