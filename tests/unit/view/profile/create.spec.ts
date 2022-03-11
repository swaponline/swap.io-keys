import CreateProfile from '@/views/Profile/Create.vue'
import SwapStepper from '@/components/UI/SwapStepper.vue'
import CreateProfileSelectColorScheme from '@/components/Profile/SelectColorScheme.vue'
import CreateProfileFormPassword from '@/components/Profile/FormPassword.vue'
import CreateProfileHeader from '@/components/Profile/Header.vue'
import mnemonicPhraseTable from '@/components/Profile/MnemonicPhraseTable.vue'
import { shallowMount } from '@vue/test-utils'
import * as commonUtils from '@/utils/common'
import flushPromises from 'flush-promises'
import SwapButton from '@/components/UI/SwapButton.vue'
import { stubComponent } from '../../__helpers__/stubComponent'

const STEPS = {
  1: 0,
  2: 1,
  3: 2,
  4: 3
}

jest.mock('@/windowParentPostMessage.ts', () => jest.fn())

const CreateProfileSelectColorSchemeStub = stubComponent(CreateProfileSelectColorScheme, {
  template: `
    <div>
      <slot name="actions"></slot>
    </div>
  `
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
commonUtils.setCSSCustomProperty = jest.fn()

describe('ProfileCreate page', () => {
  let wrapper

  const findSwapStepper = () => wrapper.findComponent(SwapStepper)
  const findCreateProfileSelectColorScheme = () => wrapper.findComponent(CreateProfileSelectColorScheme)
  const findButtonByText = text => {
    return wrapper
      .findAllComponents(SwapButton)
      .filter(buttonWrapper => buttonWrapper.text().includes(text))
      .at(0)
  }

  afterEach(() => {
    wrapper.destroy()
    wrapper = null
  })

  const createComponent = () => {
    wrapper = shallowMount(CreateProfile, {
      stubs: {
        SwapStepper,
        CreateProfileSelectColorScheme: CreateProfileSelectColorSchemeStub
      }
    })
  }

  describe('step 1', () => {
    it('After creating the Create profile page, there are component SwapStepper', () => {
      createComponent()
      expect(findSwapStepper().exists()).toBe(true)
    })

    it('After creating the Create profile page, there are component CreateProfileSelectColorScheme', () => {
      createComponent()
      expect(findCreateProfileSelectColorScheme().exists()).toBe(true)
    })

    it('Update selected-color-scheme', async () => {
      createComponent()
      const createProfileSelectColorScheme = findCreateProfileSelectColorScheme()

      const newColorScheme = {
        background: 'Test',
        color: 'Test',
        selectionColor: 'Test',
        colorForDarkTheme: 'Test'
      }

      createProfileSelectColorScheme.vm.$emit('update:selected-color-scheme', newColorScheme)
      await wrapper.vm.$nextTick()

      expect(createProfileSelectColorScheme.props().selectedColorScheme).toEqual(newColorScheme)
    })

    it('The component responds to the refresh-color-schemes event ', async () => {
      await flushPromises()
      createComponent()

      await flushPromises()

      const createProfileSelectColorScheme = findCreateProfileSelectColorScheme()
      await flushPromises()
      console.log(createProfileSelectColorScheme.props().options)
      const oldOptions = createProfileSelectColorScheme.props().options
      await flushPromises()
      createProfileSelectColorScheme.vm.$emit('refresh-color-schemes')
      await flushPromises()

      expect(createProfileSelectColorScheme.props().options).toEqual(expect.not.objectContaining(oldOptions))
    })

    it('The button to go to the next step is blocked until a color theme is selected', () => {
      createComponent()

      const backButton = findButtonByText('Next')

      expect(backButton.attributes('disabled')).toBe('true')
    })

    it('The text of the popup hint in the disabled button corresponds to reality', () => {
      createComponent()

      const nextButton = findButtonByText('Next')

      expect(nextButton.attributes('tooltip')).toContain('Please pick a color scheme to proceed.')
    })

    it('The next button unlocks after selecting a color theme', async () => {
      await flushPromises()
      createComponent()
      await flushPromises()

      const createProfileSelectColorScheme = findCreateProfileSelectColorScheme()

      const nextButton = findButtonByText('Next')
      expect(nextButton.attributes().disabled).toBe('true')

      const selectedColorScheme = createProfileSelectColorScheme.props().options[0]
      await createProfileSelectColorScheme.vm.$emit('update:selected-color-scheme', selectedColorScheme)
      createProfileSelectColorScheme.vm.$emit('select-color-scheme')
      await wrapper.vm.$nextTick()
      expect(nextButton.attributes().disabled).toBe(undefined)
    })

    // eslint-disable-next-line vue/max-len
    // it('After selecting a color theme and clicking on the Next button, the transition to the next step takes place', async () => {
    //   await flushPromises()
    //   createComponent()

    //   await flushPromises()

    //   const createProfileSelectColorScheme = findCreateProfileSelectColorScheme()

    //   await flushPromises()
    //   const nextButton = findButtonByText('Next')
    //   const selectedColorScheme = createProfileSelectColorScheme.props().options[0]

    //   createProfileSelectColorScheme.vm.$emit('update:selected-color-scheme', selectedColorScheme)
    //   createProfileSelectColorScheme.vm.$emit('select-color-scheme')
    //   const findSwapStepperContentItems = () => wrapper.findAll('[data-test-id=swap-stepper-content]')
    //   expect(findSwapStepperContentItems().wrappers[STEPS[2]].attributes().style).toBe('display: none;')

    //   await nextButton.vm.$emit('click')

    //   expect(findSwapStepperContentItems().wrappers[STEPS[2]].attributes().style).toBe('')
    // })
  })

  // describe('step 2', () => {
  //   let findSwapStepperContentItems
  //   let nextButton

  //   beforeEach(async () => {
  //     createComponent()

  //     const createProfileSelectColorScheme = findCreateProfileSelectColorScheme()

  //     nextButton = findButtonByText('Next')
  //     const selectedColorScheme = createProfileSelectColorScheme.props().options[0]

  //     createProfileSelectColorScheme.vm.$emit('update:selected-color-scheme', selectedColorScheme)
  //     createProfileSelectColorScheme.vm.$emit('select-color-scheme')
  //     findSwapStepperContentItems = () => wrapper.findAll('[data-test-id=swap-stepper-content]')

  //     await nextButton.vm.$emit('click')
  //   })

  //   it('', () => {})
  // })
})
