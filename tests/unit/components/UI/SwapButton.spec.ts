import SwapButton from '@/components/UI/SwapButton.vue'
import { shallowMount } from '@vue/test-utils'

const slotText = 'slot test'

describe('Swap button', () => {
  let wrapper

  const createComponent = ({ propsData = {}, provide = {} } = {}) => {
    wrapper = shallowMount(SwapButton, {
      propsData: {
        ...propsData
      },
      provide: {
        mediaQueries: { mobile: false },
        ...provide
      },
      slots: {
        default: slotText
      }
    })
  }

  it('renders slot', () => {
    createComponent()

    expect(wrapper.text()).toBe(slotText)
  })

  it('renders tooltip', () => {
    createComponent({ propsData: { tooltip: 'Tooltip' } })

    const buttonTooltip = wrapper.find('[data-testid="button-tooltip"]')

    expect(buttonTooltip.exists()).toBe(true)
  })

  it.each`
    propName
    ${'round'}
    ${'text'}
    ${'disabled'}
  `('has class for styles $propName', ({ propName }) => {
    createComponent({ propsData: { [propName]: true } })

    expect(wrapper.element.classList.value.includes(propName)).toBe(true)
  })
})
