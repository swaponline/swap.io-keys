import FormPassword from '@/components/Profile/FormPassword.vue'
import SwapInput from '@/components/UI/SwapInput.vue'
import { shallowMount } from '@vue/test-utils'

describe('Form password', () => {
  let wrapper

  const createComponent = ({ propsData = {}, provide = {} } = {}) => {
    wrapper = shallowMount(FormPassword, {
      propsData: {
        ...propsData
      },
      provide: {
        mediaQueries: { mobile: false },
        ...provide
      },
      scopedSlots: {
        actions: '<p data-test-id="slotActions" slot-scope="actionsData">{{actionsData.isValidPassword}}</p>'
      }
    })
  }

  it('emits update password value', () => {
    createComponent()
    const swapInput = wrapper.findComponent(SwapInput)
    const password = '1234'
    swapInput.vm.$emit('input', password)

    const eventUpdatePassword = wrapper.emitted('input')
    expect(eventUpdatePassword).toBeTruthy()
    expect(eventUpdatePassword[0][0]).toEqual(password)
  })

  it('emits submit form', async () => {
    const password = '123456'
    createComponent({ propsData: { value: password } })
    const confirmpasswordInput = wrapper.findAllComponents(SwapInput).wrappers[1]
    confirmpasswordInput.vm.$emit('input', password)

    const form = wrapper.find('form')
    await form.trigger('submit')

    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it.each`
    password    | isValid
    ${'123'}    | ${'false'}
    ${'123456'} | ${'true'}
  `('provides valid state to actions slot for $password', async ({ password, isValid }) => {
    createComponent({ propsData: { value: password } })
    const swapInput = wrapper.findAllComponents(SwapInput).wrappers[1]
    const actionsSlot = wrapper.find('[data-test-id="slotActions"]')

    swapInput.vm.$emit('input', password)
    await wrapper.vm.$nextTick()

    expect(actionsSlot.element.innerHTML).toBe(isValid)
  })
})
