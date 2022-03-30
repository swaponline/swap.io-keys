import SwapStepper from '@/components/UI/SwapStepper.vue'

import { shallowMount } from '@vue/test-utils'

const STEPS = {
  1: 'Step 1',
  2: 'Step 2'
}

describe('SwapHelpText', () => {
  let wrapper

  const createComponent = ({ propsData = {}, provide = {} } = {}) => {
    wrapper = shallowMount(SwapStepper, {
      propsData: {
        ...propsData
      },
      provide: {
        ...provide
      },
      directives: {
        closePopover: jest.fn()
      },
      slots: STEPS
    })
  }

  it('renders all steps', () => {
    createComponent()

    expect(wrapper.text().includes(STEPS[1])).toBe(true)
    expect(wrapper.text().includes(STEPS[2])).toBe(true)
  })

  it('shows active step', () => {
    const currentStep = 1
    createComponent({ propsData: { currentStep } })

    const stepWrappers = wrapper.findAll('[data-testid=swap-step]')

    expect(stepWrappers.wrappers[0].element.style.display).not.toBe('none')
    expect(stepWrappers.wrappers[1].element.style.display).toBe('none')
  })

  it('changes active step', async () => {
    const currentStep = 1
    createComponent({ propsData: { currentStep } })

    await wrapper.setProps({ currentStep: 2 })

    const stepWrappers = wrapper.findAll('[data-testid=swap-step]')

    expect(stepWrappers.wrappers[0].element.style.display).toBe('none')
    expect(stepWrappers.wrappers[1].element.style.display).not.toBe('none')
  })
})
