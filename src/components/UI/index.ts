import SvgIcon from './SvgIcon.vue'
import SwapButton from './SwapButton.vue'
import SwapInput from './SwapInput.vue'

export default {
  install(Vue) {
    Vue.component('SvgIcon', SvgIcon)
    Vue.component('SwapButton', SwapButton)
    Vue.component('SwapInput', SwapInput)
  }
}
