import SwapHelpText from '@/components/UI/SwapHelpText.vue'
import SwapButton from '@/components/UI/SwapButton.vue'
import { MatchMedia } from 'vue-component-media-queries'

import { shallowMount } from '@vue/test-utils'
import { stubComponent } from '../../__helpers__/stubComponent'

const createMatchMediaStub = ({ phone = false } = {}) => {
  return stubComponent(MatchMedia, {
    render(h) {
      return h('div', [this.$scopedSlots.default?.({ phone })])
    }
  })
}

const TEST_TEXT = 'Test help text'

describe('SwapHelpText', () => {
  let wrapper

  const createComponent = ({ propsData = {}, provide = {}, stubs = {} } = {}) => {
    wrapper = shallowMount(SwapHelpText, {
      propsData: {
        ...propsData
      },
      provide: {
        ...provide
      },
      directives: {
        closePopover: jest.fn()
      },
      stubs: {
        MatchMedia: createMatchMediaStub(),
        ...stubs
      },
      slots: {
        default: TEST_TEXT
      }
    })
  }

  it('renders button', () => {
    const matchMediaStub = createMatchMediaStub({ phone: true })
    createComponent({ stubs: { MatchMedia: matchMediaStub } })

    const buttonWrapper = wrapper.findComponent(SwapButton)

    expect(buttonWrapper.exists()).toBe(true)
    expect(wrapper.text().includes(TEST_TEXT)).toBe(false)
  })

  it('provides tooltip text', () => {
    const matchMediaStub = createMatchMediaStub({ phone: true })
    createComponent({ stubs: { MatchMedia: matchMediaStub } })

    const buttonWrapper = wrapper.findComponent(SwapButton)

    expect(buttonWrapper.props().tooltip).toBe(TEST_TEXT)
  })

  it('renders help text', () => {
    const matchMediaStub = createMatchMediaStub({ phone: false })
    createComponent({ stubs: { MatchMedia: matchMediaStub } })

    expect(wrapper.text().includes(TEST_TEXT)).toBe(true)
  })
})
