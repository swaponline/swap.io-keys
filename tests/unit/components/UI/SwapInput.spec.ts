import SwapInput from '@/components/UI/SwapInput.vue'
import { shallowMount } from '@vue/test-utils'

describe('SwapInput', () => {
  let wrapper

  const appendSlotText = 'Append slot text'
  const prependSlotText = 'Prepend slot text'

  const findToogleTypeButton = () => wrapper.find('button')
  const findInput = () => wrapper.find('input')

  const createComponent = ({ propsData = {}, provide = {} } = {}) => {
    wrapper = shallowMount(SwapInput, {
      propsData: {
        ...propsData
      },
      provide: {
        mediaQueries: { mobile: false },
        ...provide
      },
      slots: {
        prepend: prependSlotText,
        append: appendSlotText
      }
    })
  }

  it('renders prepend slot', () => {
    createComponent()

    expect(wrapper.text().includes(prependSlotText)).toBe(true)
  })

  it('renders append slot', () => {
    createComponent()

    expect(wrapper.text().includes(appendSlotText)).toBe(true)
  })

  it('show toggle button if type password', () => {
    createComponent({ propsData: { type: 'password' } })

    expect(findToogleTypeButton().exists()).toBe(true)
  })

  it('change button text when toggle type', async () => {
    createComponent({ propsData: { type: 'password' } })
    const toggleButton = findToogleTypeButton()
    expect(toggleButton.text()).toBe('Show')

    await toggleButton.trigger('click')

    expect(toggleButton.text()).toBe('Hide')
  })

  it('change input type', async () => {
    createComponent({ propsData: { type: 'password' } })
    const inputWrapper = findInput()
    expect(inputWrapper.element.type).toBe('password')

    await findToogleTypeButton().trigger('click')

    expect(inputWrapper.element.type).toBe('text')
  })

  it('has focused class when focus', async () => {
    createComponent()

    const inputWrapper = findInput()
    await inputWrapper.trigger('focus')

    expect(wrapper.element.classList.value.includes('focused'))
  })

  it('has error class when error', () => {
    createComponent({ propsData: { isError: true } })

    expect(wrapper.element.classList.value.includes('error'))
  })

  it('emits input event', async () => {
    createComponent()
    const testText = 'test'

    const inputWrapper = findInput()
    await inputWrapper.trigger('input', testText)

    expect(wrapper.emitted().input).toBeTruthy()
  })
})
