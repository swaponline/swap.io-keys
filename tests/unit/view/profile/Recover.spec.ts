import RecoverProfile from '@/views/Profile/Recover.vue'
import SwapStepper from '@/components/UI/SwapStepper.vue'
import { shallowMount } from '@vue/test-utils'
import MnemonicPhraseTable from '@/components/Profile/MnemonicPhraseTable.vue'
import SwapButton from '@/components/UI/SwapButton.vue'
import CreateProfileFormPassword from '@/components/Profile/FormPassword.vue'
import { stubComponent } from '../../__helpers__/stubComponents'
import {
  STEPS,
  DEFAULT_TABLE_MATRIX,
  CHANGE_TABLE_MATRIX,
  FULL_TABLE_MATRIX,
  VALID_PASSWORD,
  INVALID_PASSWORD
} from '../../__mocks__/profile/Recover.mock'

const createProfileFormPasswordStub = stubComponent(CreateProfileFormPassword, {
  template: `
    <div>
      <slot name="actions" ></slot>
    </div>
  `
})

describe('Recover Profile', () => {
  let wrapper

  const findMnemonicPhraseTable = () => wrapper.findComponent(MnemonicPhraseTable)
  const findCreateProfileFormPassword = () => wrapper.findComponent(CreateProfileFormPassword)
  const findSwapStepper = () => wrapper.findComponent(SwapStepper)
  const findButtonByText = (text, index) => {
    return wrapper
      .findAllComponents(SwapButton)
      .filter(buttonWrapper => buttonWrapper.text().includes(text))
      .at(index)
  }
  const findSwapStepperContentItems = () => wrapper.findAll('[data-test-id=swap-stepper-content]')

  afterEach(() => {
    wrapper.destroy()
  })

  const createComponent = () => {
    wrapper = shallowMount(RecoverProfile, {
      stubs: {
        SwapStepper,
        CreateProfileFormPassword: createProfileFormPasswordStub
      }
    })
  }

  describe('step 1', () => {
    it('After creating the Recover profile page, there are component SwapStepper', () => {
      createComponent()
      expect(findSwapStepper().exists()).toBe(true)
    })

    it('After creating the Recover profile page, there are component MnemonicPhraseTable', () => {
      createComponent()
      expect(findMnemonicPhraseTable().exists()).toBe(true)
    })

    it(`
        After creating the Recover profile page, 
        prop component mnemonicPhraseTable to equal DEFAULT_TABLE_MATRIX`, () => {
      createComponent()

      const mnemonicPhraseTable = findMnemonicPhraseTable()

      expect(mnemonicPhraseTable.props().tableMatrix).toEqual(DEFAULT_TABLE_MATRIX)
    })

    it(`
        after the change event in component mnemonicPhraseTable,
        prop table Matrix to equal the modified matrix`, async () => {
      createComponent()

      const mnemonicPhraseTable = findMnemonicPhraseTable()

      mnemonicPhraseTable.vm.$emit('change', CHANGE_TABLE_MATRIX)
      await wrapper.vm.$nextTick()

      expect(mnemonicPhraseTable.props().tableMatrix).toEqual(CHANGE_TABLE_MATRIX)
    })

    it('The button to go to the next step is blocked until the mnemonicPhrase is entered', () => {
      createComponent()

      const backButton = findButtonByText('Next', 0)

      expect(backButton.props().disabled).toBe(true)
    })

    it('The text of the popup hint in the disabled button corresponds to reality', () => {
      createComponent()

      const nextButton = findButtonByText('Next', 0)

      expect(nextButton.attributes('tooltip')).toContain('Complete your secret phrase')
    })

    it(`
       After entering the phrase and clicking on the Next button, 
       the transition to the next step takes place
    `, async () => {
      createComponent()

      const mnemonicPhraseTable = findMnemonicPhraseTable()
      mnemonicPhraseTable.vm.$emit('change', FULL_TABLE_MATRIX)
      await wrapper.vm.$nextTick()

      const nextButton = findButtonByText('Next', 0)

      await nextButton.vm.$emit('click')

      expect(findSwapStepperContentItems().wrappers[STEPS[1]].attributes().style).toBe('display: none;')
    })
  })

  describe('step 2', () => {
    beforeEach(async () => {
      createComponent()

      const mnemonicPhraseTable = findMnemonicPhraseTable()
      mnemonicPhraseTable.vm.$emit('change', FULL_TABLE_MATRIX)
      await wrapper.vm.$nextTick()

      const nextButton = findButtonByText('Next', 0)
      await nextButton.vm.$emit('click')
    })

    it('After going to the second step, there is a component CreateProfileFormPassword', () => {
      expect(findCreateProfileFormPassword().exists()).toBe(true)
    })

    it('After clicking on the Back button, the transition to the previous step takes place', async () => {
      const backButton = findButtonByText('Back', 1)
      await backButton.vm.$emit('click')

      expect(findSwapStepperContentItems().wrappers[STEPS[2]].attributes().style).toBe('display: none;')

      expect(findSwapStepperContentItems().wrappers[STEPS[1]].attributes().style).toBe('')
    })

    it(`
        after the input event in component CreateProfileForm Password,
        prop value to equal to the entered value`, async () => {
      const createProfileFormPassword = findCreateProfileFormPassword()

      await createProfileFormPassword.vm.$emit('input', VALID_PASSWORD)
      await wrapper.vm.$nextTick()

      expect(createProfileFormPassword.props().value).toBe(VALID_PASSWORD)
    })

    // it('', async () => {
    //   const createProfileFormPassword = findCreateProfileFormPassword()

    //   await createProfileFormPassword.vm.$emit('input', VALID_PASSWORD)
    //   await wrapper.vm.$nextTick()

    //   const nextButton = findButtonByText('Recover', 0)

    //   expect(nextButton.props().disabled).toBe(true)
    // })
  })
})
