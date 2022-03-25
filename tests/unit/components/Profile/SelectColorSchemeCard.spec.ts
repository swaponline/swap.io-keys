import SelectColorSchemeCard from '@/components/Profile/SelectColorSchemeCard.vue'

import { shallowMount } from '@vue/test-utils'
import Canvg from 'canvg'
import { mockColorScheme1 } from '../../__mocks__/userColorScheme.mock'

Canvg.fromString = jest.fn().mockReturnValue({
  start: jest.fn(),
  stop: jest.fn()
})

describe('Select color scheme card', () => {
  let wrapper

  const createComponent = ({ propsData = {}, provide = {} } = {}) => {
    wrapper = shallowMount(SelectColorSchemeCard, {
      propsData: {
        ...propsData
      },
      provide: {
        ...provide
      }
    })
  }

  it('sets selected class', () => {
    createComponent({ propsData: { isSelected: true, colorScheme: mockColorScheme1 } })

    expect(wrapper.element.classList.value.includes('select')).toBe(true)
  })

  it('emits select', async () => {
    createComponent({ propsData: { isSelected: true, colorScheme: mockColorScheme1 } })

    await wrapper.trigger('click')

    expect(wrapper.emitted().select).toBeTruthy()
  })
})
