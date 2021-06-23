import SvgIcon from './SvgIcon.vue'
import SwapButton from './SwapButton.vue'
import SwapInput from './SwapInput.vue'
import SwapButtonGoBack from './SwapButtonGoBack.vue'

export default {
  install(Vue): void {
    Vue.component('SvgIcon', SvgIcon)
    Vue.component('SwapButton', SwapButton)
    Vue.component('SwapInput', SwapInput)
    Vue.component('SwapButtonGoBack', SwapButtonGoBack)
  }
}
