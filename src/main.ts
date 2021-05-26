import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import messageHandler from './messageHandler'
import windowParentPostMessage from './windowParentPostMessage'
import UI from './components/UI'
import '@/assets/scss/base.scss'

Vue.use(UI)
// Vue.config.productionTip = false

messageHandler()
windowParentPostMessage({ key: 'createWindow' })

// Не разрешаем обычное открытие, только в iframe и только на определенном домене
if (window.top !== window.self && window.location.ancestorOrigins[0] === process.env.VUE_APP_HOME_URL) {
  /* eslint-disable vue/require-name-property */
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
}
