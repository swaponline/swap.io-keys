import RecoverProfile from '@/views/Profile/Recover.vue'
import SwapStepper from '@/components/UI/SwapStepper.vue'
import { shallowMount } from '@vue/test-utils'
import MnemonicPhraseTable from '@/components/Profile/MnemonicPhraseTable.vue'
import SwapButton from '@/components/UI/SwapButton.vue'
import CreateProfileFormPassword from '@/components/Profile/FormPassword.vue'
import { STEPS_RECOVER_PROFILE, MNEMONIC_PHRASE_WRITE, FORM_PASSWORD } from '@/constants/profile'
import { profileMessageTypes } from '@/constants/messageTypes'
import windowParentPostMessage from '@/windowParentPostMessage'
import { stubComponent } from '../../__helpers__/stubComponents'
import flushPromises from '../../__helpers__/flushPromises'
import {
  DEFAULT_TABLE_MATRIX,
  CHANGE_TABLE_MATRIX,
  FULL_TABLE_MATRIX,
  USER_COLOR_SCHEME
} from '../../__mocks__/profile/Recover.mock'

jest.mock('@/windowParentPostMessage')
jest.mock('@/services/profile', () => {
  return {
    profileService: {
      createProfile: jest.fn().mockResolvedValue({
        cryptoProfile: {},
        shortKey: 'test'
      }),
      getSeedFromMnemonic: jest.fn().mockResolvedValue({}),
      getPublicKey: jest.fn().mockReturnValue(''),
      getUserColorScheme: jest.fn().mockReturnValue({
        background: 'test',
        color: 'test',
        colorForDarkTheme: 'test',
        selectionColor: 'test'
      }),
      saveProfileByShortKey: jest.fn()
    }
  }
})

const CreateProfileFormPasswordStub = (isValidPassword = false) => {
  return stubComponent(CreateProfileFormPassword, {
    render(h) {
      return h('div', [this.$scopedSlots.actions?.({ isValidPassword })])
    }
  })
}

const mockChangeActiveStep = jest.fn()

const SwapStepperStub = stubComponent(SwapStepper, {
  render(h) {
    return h('div', [
      this.$scopedSlots['1']?.({ changeActiveStep: mockChangeActiveStep }),
      this.$scopedSlots['2']?.({ changeActiveStep: mockChangeActiveStep })
    ])
  }
})

describe('Recover Profile', () => {
  let wrapper

  const findMnemonicPhraseTable = () => wrapper.findComponent(MnemonicPhraseTable)
  const findCreateProfileFormPassword = () => wrapper.findComponent(CreateProfileFormPassword)
  const findSwapStepper = () => wrapper.findComponent(SwapStepper)
  const findAllButtonsByText = (text, context = wrapper) => {
    return context.findAllComponents(SwapButton).filter(buttonWrapper => buttonWrapper.text().includes(text))
  }
  const findButtonByText = (text, context = wrapper) => findAllButtonsByText(text, context).at(0)

  const goToSeconStep = async () => {
    const mnemonicPhraseTable = findMnemonicPhraseTable()
    mnemonicPhraseTable.vm.$emit('change', FULL_TABLE_MATRIX)
    await wrapper.vm.$nextTick()

    const nextButton = findButtonByText('Next')
    await nextButton.vm.$emit('click')
  }

  afterEach(() => {
    wrapper.destroy()
  })

  const createComponent = ({ stubs = {} } = {}) => {
    wrapper = shallowMount(RecoverProfile, {
      stubs: {
        SwapStepper: SwapStepperStub,
        CreateProfileFormPassword: CreateProfileFormPasswordStub(),
        ...stubs
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

      const backButton = findButtonByText('Next')

      expect(backButton.props().disabled).toBe(true)
    })

    it('The text of the popup hint in the disabled button corresponds to reality', () => {
      createComponent()

      const nextButton = findButtonByText('Next')

      expect(nextButton.props().tooltip).toContain('Complete your secret phrase')
    })

    it(`
       After entering the phrase and clicking on the Next button,
       the transition to the next step takes place
    `, async () => {
      createComponent()

      const mnemonicPhraseTable = findMnemonicPhraseTable()
      mnemonicPhraseTable.vm.$emit('change', FULL_TABLE_MATRIX)
      await wrapper.vm.$nextTick()

      const nextButton = findButtonByText('Next')

      await nextButton.vm.$emit('click')

      expect(mockChangeActiveStep).toBeCalledWith(STEPS_RECOVER_PROFILE[FORM_PASSWORD])
    })
  })

  describe('step 2', () => {
    beforeEach(async () => {
      createComponent()

      await goToSeconStep()
    })

    it('After going to the second step, there is a component CreateProfileFormPassword', () => {
      expect(findCreateProfileFormPassword().exists()).toBe(true)
    })

    it('After clicking on the Back button, the transition to the previous step takes place', async () => {
      const formPassword = wrapper.findComponent(CreateProfileFormPassword)
      const backButton = findButtonByText('Back', formPassword)

      await backButton.vm.$emit('click')

      expect(mockChangeActiveStep).toBeCalledWith(STEPS_RECOVER_PROFILE[MNEMONIC_PHRASE_WRITE])
    })

    it('disables the button when the password form says the password is invalid', async () => {
      createComponent({ stubs: { CreateProfileFormPassword: CreateProfileFormPasswordStub(false) } })
      await goToSeconStep()

      const recoverButton = findButtonByText('Recover')

      expect(recoverButton.props().disabled).toBe(true)
      expect(recoverButton.props().tooltip).toBe('Please come up with a password.')
    })

    it('enables the button when the password form says the password is valid', async () => {
      createComponent({ stubs: { CreateProfileFormPassword: CreateProfileFormPasswordStub(true) } })
      await goToSeconStep()

      const recoverButton = findButtonByText('Recover')

      expect(recoverButton.props().disabled).toBe(false)
      expect(recoverButton.props().tooltip).toBe(null)
    })

    it('sends post message with created profile', async () => {
      const recoverButton = findButtonByText('Recover')

      recoverButton.vm.$emit('click')
      await wrapper.vm.$nextTick()
      await flushPromises()

      expect(windowParentPostMessage).toBeCalledWith(
        expect.objectContaining({
          message: {
            type: profileMessageTypes.PROFILE_RECOVERED,
            payload: {
              profile: { colorScheme: USER_COLOR_SCHEME, publicKey: 'test' }
            }
          }
        })
      )
    })
  })
})
