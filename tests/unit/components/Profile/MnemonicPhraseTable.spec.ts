import MnemonicPhraseTable from '@/components/Profile/MnemonicPhraseTable.vue'
import SwapInput from '@/components/UI/SwapInput.vue'

import { shallowMount } from '@vue/test-utils'

const testTable = [
  { input: true, value: 'test1' },
  { input: false, value: 'test2' },
  { input: true, value: 'test3' },
  { input: false, false: 'test4' }
]

describe('Mnemonic phrase table', () => {
  let wrapper

  const createComponent = ({ propsData = {}, provide = {} } = {}) => {
    wrapper = shallowMount(MnemonicPhraseTable, {
      propsData: {
        ...propsData
      },
      provide: {
        ...provide
      }
    })
  }

  it('renders inputs and values', () => {
    createComponent({ propsData: { tableMatrix: testTable } })

    expect(wrapper.findAllComponents(SwapInput).length).toBe(2)
    expect(wrapper.findAll('[data-testid=matrix-word]').length).toBe(2)
  })

  it('sets input value', () => {
    createComponent({ propsData: { tableMatrix: testTable } })
    const inputWrapper = wrapper.findComponent(SwapInput)

    expect(inputWrapper.props().value).toBe(testTable[0].value)
  })

  it('emits change table', () => {
    createComponent({ propsData: { tableMatrix: testTable } })
    const inputWrapper = wrapper.findComponent(SwapInput)

    inputWrapper.vm.$emit('input', 'test')

    expect(wrapper.emitted().change).toBeTruthy()
  })

  it('updates local table', async () => {
    createComponent()
    expect(wrapper.findComponent(SwapInput).exists()).toBe(false)

    await wrapper.setProps({ tableMatrix: testTable })

    expect(wrapper.findComponent(SwapInput).exists()).toBe(true)
  })
})
