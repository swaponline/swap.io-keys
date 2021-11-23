import SvgIcon from './SvgIcon.vue'
import SwapButton from './SwapButton.vue'
import SwapInput from './SwapInput.vue'
import SwapButtonGoBack from './SwapButtonGoBack.vue'
import EnterPassword from './EnterPassword.vue'
import SwapHelpText from './SwapHelpText.vue'
import SwapStepper from './SwapStepper.vue'

export default {
  // У аргумента Vue должен быть тип
  // eslint-disable-next-line
  install(Vue): void {
    Vue.component('SvgIcon', SvgIcon)
    Vue.component('SwapButton', SwapButton)
    Vue.component('SwapInput', SwapInput)
    Vue.component('SwapButtonGoBack', SwapButtonGoBack)
    Vue.component('SwapHelpText', SwapHelpText)
    Vue.component('EnterPassword', EnterPassword)
    Vue.component('SwapStepper', SwapStepper)
  }
}
