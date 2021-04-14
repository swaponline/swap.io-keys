import Vue from 'vue'
import App from './App.vue'
import messageHandler from './messageHandler'
import windowParentPostMessage from './windowParentPostMessage'

messageHandler()
windowParentPostMessage({ key: 'createWindow' })

// Не разрешаем обычное открытие, только в iframe
if (window.top !== window.self) {
  /* eslint-disable vue/require-name-property */
  new Vue({
    render: h => h(App)
  }).$mount('#app')
}
