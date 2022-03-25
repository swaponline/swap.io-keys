import SelectColorScheme from '@/components/Profile/SelectColorScheme.vue'
import SelectColorSchemeCard from '@/components/Profile/SelectColorSchemeCard.vue'
import HeaderProfile from '@/components/Profile/Header.vue'
import SwapHelpText from '@/components/UI/SwapHelpText.vue'
import SwapButton from '@/components/UI/SwapButton.vue'

import { shallowMount } from '@vue/test-utils'
import { mockColorScheme1, mockColorScheme2 } from '../../__mocks__/userColorScheme.mock'
import { stubComponent } from '../../__helpers__/stubComponent'

const HeaderProfileStub = stubComponent(HeaderProfile, {
  template: `
    <div>
      <slot></slot>
      <slot name="help-text"></slot>
    </div>
  `
})

const SwapHelpTextStub = stubComponent(SwapHelpText, {
  template: `
    <div>
      <slot></slot>
    </div>
  `
})

describe('SelectColorScheme', () => {
  let wrapper

  const createComponent = ({ propsData = {}, provide = {} } = {}) => {
    wrapper = shallowMount(SelectColorScheme, {
      propsData: {
        ...propsData
      },
      provide: {
        ...provide
      },
      stubs: {
        HeaderProfile: HeaderProfileStub,
        SwapHelpText: SwapHelpTextStub
      }
    })
  }

  const findButtonByText = text => {
    return wrapper
      .findAllComponents(SwapButton)
      .filter(buttonWrapper => buttonWrapper.text().includes(text))
      .at(0)
  }

  beforeEach(() => {
    createComponent({ propsData: { options: [mockColorScheme1, mockColorScheme2] } })
  })

  it('renders help text', () => {
    expect(wrapper.html().includes('Your own colors will protect you from phishing.')).toBe(true)
  })

  it('emits update color scheme', () => {
    const cardWrapper = wrapper.findComponent(SelectColorSchemeCard)
    cardWrapper.vm.$emit('select')

    expect(wrapper.emitted()['select-color-scheme']).toBeTruthy()
  })

  it('emits refresh color scheme', () => {
    const refreshButton = findButtonByText('Refresh colors')
    refreshButton.vm.$emit('click')

    expect(wrapper.emitted()['refresh-color-schemes']).toBeTruthy()
  })

  it('emits update select colors scheme', () => {
    const cardWrapper = wrapper.findComponent(SelectColorSchemeCard)
    cardWrapper.vm.$emit('select')

    const emitted = wrapper.emitted()['update:selected-color-scheme'][0][0]

    expect(emitted).toEqual(mockColorScheme1)
  })

  it('renders all options', () => {
    const cardWrappers = wrapper.findAllComponents(SelectColorSchemeCard)

    expect(cardWrappers.length).toBe(2)
  })
})
