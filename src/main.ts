import Vue from 'vue'
import { FIREFOX } from '@/constants/browsers'
import VTooltip from 'v-tooltip'
import UaParser from 'ua-parser-js'
import App from './App.vue'
import router from './router'
import store from './store'
import windowParentPostMessage from './windowParentPostMessage'
import UI from './components/UI'
import '@/assets/scss/base.scss'

Vue.use(VTooltip, {
  defaultTrigger: window.innerWidth > 768 ? 'hover focus click' : 'click'
})
Vue.use(UI)
// Vue.config.productionTip = false
const uaParser = new UaParser()
const { name: browserName } = uaParser.getBrowser()
let shouldCreateIframe = false

function checkingIframeAndDomain(location: string): boolean {
  return window.top !== window.self && location === process.env.VUE_APP_HOME_URL
}

windowParentPostMessage({ key: 'createWindow' })

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
    render: h => h(App)
  }).$mount('#app')
}

// TODO: Разобраться почему не работает такая реализация
// messageHandler().then(() => {
//   app.mount('#app') // or new Vue({ /* options */ }).mount('#app')
// })
