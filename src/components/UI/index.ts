import SvgIcon from './SvgIcon.vue'
import SwapButton from './SwapButton.vue'
import SwapInput from './SwapInput.vue'
import SwapButtonGoBack from './SwapButtonGoBack.vue'
import EnterPassword from './EnterPassword.vue'

export default {
  // У аргумента Vue должен быть тип
  // eslint-disable-next-line
  install(Vue): void {
    Vue.component('SvgIcon', SvgIcon)
    Vue.component('SwapButton', SwapButton)
    Vue.component('SwapInput', SwapInput)
    Vue.component('SwapButtonGoBack', SwapButtonGoBack)
    Vue.component('EnterPassword', EnterPassword)
  }
}
