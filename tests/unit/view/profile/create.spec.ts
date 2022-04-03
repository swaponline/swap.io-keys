import CreateProfile from '@/views/Profile/Create.vue'
import SwapStepper from '@/components/UI/SwapStepper.vue'
import CreateProfileSelectColorScheme from '@/components/Profile/SelectColorScheme.vue'
import CreateProfileFormPassword from '@/components/Profile/FormPassword.vue'
import MnemonicPhraseTable from '@/components/Profile/MnemonicPhraseTable.vue'
import { shallowMount } from '@vue/test-utils'
import * as commonUtils from '@/utils/common'
import SwapButton from '@/components/UI/SwapButton.vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import { profileService } from '@/services/profile'
import { profileMessageTypes } from '@/constants/messageTypes'
import { flushPromises } from '../../__helpers__/flushPromises'
import { stubComponent } from '../../__helpers__/stubComponent'

const mockMnemonicPhrase = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7']
const mockPassword = 'MockPassword'

const mockSelectedColorScheme = {
  background: 'Test',
  color: 'Test 123',
  selectionColor: 'Test',
  colorForDarkTheme: 'Test'
}

jest.mock('@/windowParentPostMessage')
jest.mock('@/services/profile', () => {
  return {
    profileService: {
      createProfile: jest.fn().mockResolvedValue({
        cryptoProfile: {},
        shortKey: 'test'
      }),
      saveProfileByShortKey: jest.fn(),
      getMnemonicPhrase: jest.fn().mockReturnValue(['test']),
      getSeedFromMnemonic: jest.fn().mockResolvedValue({}),
      getPublicKey: jest.fn().mockReturnValue(''),
      getUserColorScheme: jest.fn().mockReturnValue({
        background: '',
        color: '',
        colorForDarkTheme: '',
        selectionColor: ''
      }),
      resetProfilesParameters: jest.fn(),
      resetSelectedProfileParameters: jest.fn(),
      setProfilesParameters: jest.fn(),
      getSelectedProfileParameters: jest.fn().mockReturnValue({
        colorScheme: {
          background: 'Mock',
          color: 'Mock',
          colorForDarkTheme: 'Mock',
          selectionColor: 'Mock'
        },
        encryptionParameters: {
          password: 'MockPassword',
          mnemonicPhrase: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7'],
          publicKey: null,
          seed: null
        }
      })
    }
  }
})

const CreateProfileSelectColorSchemeStub = stubComponent(CreateProfileSelectColorScheme, {
  template: `
    <div>
      <slot name="actions"></slot>
    </div>
  `
})

const mockChangeActiveStep = jest.fn()

const SwapStepperStub = stubComponent(SwapStepper, {
  render(h) {
    return h('div', [
      this.$scopedSlots['1']?.({ changeActiveStep: mockChangeActiveStep }),
      this.$scopedSlots['2']?.({ changeActiveStep: mockChangeActiveStep }),
      this.$scopedSlots['3']?.({ changeActiveStep: mockChangeActiveStep }),
      this.$scopedSlots['4']?.({ changeActiveStep: mockChangeActiveStep })
    ])
  }
})

const CreateProfileFormPasswordStub = (isValidPassword = false) => {
  return stubComponent(CreateProfileFormPassword, {
    render(h) {
      return h('div', [this.$scopedSlots.actions?.({ isValidPassword })])
    }
  })
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
commonUtils.setCSSCustomProperty = jest.fn()

describe('ProfileCreate page', () => {
  let wrapper

  const createComponent = ({ stubs = {} } = {}) => {
    wrapper = shallowMount(CreateProfile, {
      stubs: {
        SwapStepper: SwapStepperStub,
        CreateProfileSelectColorScheme: CreateProfileSelectColorSchemeStub,
        CreateProfileFormPassword: CreateProfileFormPasswordStub(),
        ...stubs
      }
    })
  }

  const findSwapStepper = () => wrapper.findComponent(SwapStepper)
  const findCreateProfileSelectColorScheme = () => wrapper.findComponent(CreateProfileSelectColorScheme)
  const findAllButtonsByText = (text, context = wrapper) => {
    return context.findAllComponents(SwapButton).filter(buttonWrapper => buttonWrapper.text().includes(text))
  }
  const findButtonByText = (text, context = wrapper) => findAllButtonsByText(text, context).at(0)

  async function goToSecondStep() {
    findCreateProfileSelectColorScheme().vm.$emit('update:selected-color-scheme', mockSelectedColorScheme)

    findButtonByText('Next').vm.$emit('click')
    await wrapper.vm.$nextTick()
  }

  async function goToThirdStep() {
    const mnemonicStep = wrapper.find('[data-testid="step-mnemonic-phrase"]')
    findButtonByText('Next', mnemonicStep).vm.$emit('click')
    await wrapper.vm.$nextTick()
  }

  async function goToFourthStep() {
    const mnemonicEditStep = wrapper.find('[data-testid="step-mnemonic-phrase-edit"]')
    const mnemonicTable = mnemonicEditStep.findComponent(MnemonicPhraseTable)
    const tableProp = mnemonicTable.props().tableMatrix

    const correctTableMatrix = tableProp.map((word, index) => {
      return { ...word, value: mockMnemonicPhrase[index] }
    })

    mnemonicTable.vm.$emit('change', correctTableMatrix)
    await wrapper.vm.$nextTick()

    findButtonByText('Next', mnemonicEditStep).vm.$emit('click')
    await wrapper.vm.$nextTick()
  }

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.destroy()
    wrapper = null
  })

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

      createProfileSelectColorScheme.vm.$emit('update:selected-color-scheme', mockSelectedColorScheme)
      await wrapper.vm.$nextTick()

      expect(createProfileSelectColorScheme.props().selectedColorScheme).toEqual(mockSelectedColorScheme)
    })

    it('The button to go to the next step is blocked until a color theme is selected', async () => {
      createComponent()

      const createProfileSelectColorScheme = findCreateProfileSelectColorScheme()
      createProfileSelectColorScheme.vm.$emit('update:selected-color-scheme', {
        background: '',
        color: '',
        selectionColor: '',
        colorForDarkTheme: ''
      })
      await wrapper.vm.$nextTick()

      const nextButton = findButtonByText('Next')
      expect(nextButton.props().disabled).toBe(true)
    })

    it('The component responds to the refresh-color-schemes event ', async () => {
      createComponent()

      const createProfileSelectColorScheme = findCreateProfileSelectColorScheme()
      const oldOptions = createProfileSelectColorScheme.props().options

      createProfileSelectColorScheme.vm.$emit('refresh-color-schemes')
      await wrapper.vm.$nextTick()

      expect(createProfileSelectColorScheme.props().options).toEqual(expect.not.objectContaining(oldOptions))
    })

    it('The text of the popup hint in the disabled button corresponds to reality', () => {
      createComponent()

      const nextButton = findButtonByText('Next')

      expect(nextButton.attributes('tooltip')).toContain('Please pick a color scheme to proceed.')
    })

    it('The next button unlocks after selecting a color theme', async () => {
      createComponent()

      const nextButton = findButtonByText('Next')
      expect(nextButton.props().disabled).toBe(true)

      const createProfileSelectColorScheme = findCreateProfileSelectColorScheme()

      createProfileSelectColorScheme.vm.$emit('update:selected-color-scheme', mockSelectedColorScheme)
      await wrapper.vm.$nextTick()

      expect(nextButton.props().disabled).toBe(false)
    })

    it('After clicking on the Next button, the transition to the next step takes place', async () => {
      createComponent()

      const createProfileSelectColorScheme = findCreateProfileSelectColorScheme()

      const nextButton = findButtonByText('Next')

      createProfileSelectColorScheme.vm.$emit('update:selected-color-scheme', mockSelectedColorScheme)
      await wrapper.vm.$nextTick()

      nextButton.vm.$emit('click')
      await wrapper.vm.$nextTick()

      expect(mockChangeActiveStep).toBeCalledWith(2)
    })
  })

  describe('step 2', () => {
    let mnemonicStep

    beforeEach(async () => {
      createComponent()
      mnemonicStep = wrapper.find('[data-testid="step-mnemonic-phrase"]')

      await goToSecondStep()
    })

    it('provides mnemonic phrase props to MnemonicPhraseTable component', () => {
      const tableMatrixProp = mnemonicStep.findComponent(MnemonicPhraseTable).props().tableMatrix

      tableMatrixProp.forEach(({ input, value }) => {
        expect(input).toBe(false)
        expect(mockMnemonicPhrase.includes(value)).toBe(true)
      })
    })

    it('returns to the previous step', async () => {
      const backButton = findButtonByText('Back', mnemonicStep)

      backButton.vm.$emit('click')
      await wrapper.vm.$nextTick()

      expect(mockChangeActiveStep).toBeCalledWith(1)
    })

    it('switches to next step', async () => {
      const nextButton = findButtonByText('Next', mnemonicStep)

      nextButton.vm.$emit('click')
      await wrapper.vm.$nextTick()

      expect(mockChangeActiveStep).toBeCalledWith(3)
    })
  })

  describe('step 3', () => {
    let mnemonicEditStep

    beforeEach(async () => {
      createComponent()
      mnemonicEditStep = wrapper.find('[data-testid="step-mnemonic-phrase-edit"]')

      await goToSecondStep()
      await goToThirdStep()
    })

    it('provides 6 table matrix items with input=true', () => {
      const mnemonicTable = mnemonicEditStep.findComponent(MnemonicPhraseTable)
      const tableProp = mnemonicTable.props().tableMatrix
      const tableEdited = tableProp.filter(({ input }) => input)

      expect(tableEdited.length).toBe(6)
    })

    it('changes table matrix', async () => {
      const mnemonicTable = mnemonicEditStep.findComponent(MnemonicPhraseTable)
      const tableProp = mnemonicTable.props().tableMatrix
      const newTableProp = [...tableProp]
      const newValue = { value: 'Chanded value', input: true }
      const editedIndex = newTableProp.findIndex(({ input }) => input)
      newTableProp[editedIndex] = newValue

      await mnemonicTable.vm.$emit('change', newTableProp)

      expect(mnemonicTable.props().tableMatrix).toEqual(expect.arrayContaining([newValue]))
    })

    it('disables the next button if the mnemonic phrase is incorrect', () => {
      const { disabled, tooltip } = findButtonByText('Next', mnemonicEditStep).props()

      expect(disabled).toBe(true)
      expect(tooltip).toBe('Complete your secret phrase.')
    })

    it('enable the next button if the mnemonicphrase is correct', async () => {
      const mnemonicTable = mnemonicEditStep.findComponent(MnemonicPhraseTable)
      const tableProp = mnemonicTable.props().tableMatrix

      const correctTableMatrix = tableProp.map((word, index) => {
        return { ...word, value: mockMnemonicPhrase[index] }
      })

      mnemonicTable.vm.$emit('change', correctTableMatrix)
      await wrapper.vm.$nextTick()

      const nextButton = findButtonByText('Next', mnemonicEditStep)
      expect(nextButton.props().disabled).toBe(false)
      expect(nextButton.props().tooltip).toBe(null)
    })

    it('returns to the previous step', async () => {
      const backButton = findButtonByText('Back', mnemonicEditStep)
      jest.clearAllMocks()

      backButton.vm.$emit('click')
      await wrapper.vm.$nextTick()

      expect(mockChangeActiveStep).toBeCalledWith(2)
    })

    it('switches to next step', async () => {
      const nextButton = findButtonByText('Next', mnemonicEditStep)
      jest.clearAllMocks()

      nextButton.vm.$emit('click')
      await wrapper.vm.$nextTick()

      expect(mockChangeActiveStep).toBeCalledWith(4)
    })
  })

  describe('step 4', () => {
    beforeEach(async () => {
      createComponent()

      await goToSecondStep()
      await goToThirdStep()
      await goToFourthStep()
    })

    it('provides the password to the password form component', () => {
      expect(wrapper.findComponent(CreateProfileFormPassword).props().value).toBe(mockPassword)
    })

    it('updates the password', async () => {
      const createPassword = wrapper.findComponent(CreateProfileFormPassword)
      const newPassword = '12345'
      createPassword.vm.$emit('input', newPassword)
      await wrapper.vm.$nextTick()

      expect(createPassword.props().value).toBe(newPassword)
    })

    it('disable the create button if the password is invalid', () => {
      const { disabled, tooltip } = findButtonByText('Created').props()

      expect(disabled).toBe(true)
      expect(tooltip).toBe('Please come up with a password.')
    })

    it('enable the create button if the password is valid', async () => {
      createComponent({ stubs: { CreateProfileFormPassword: CreateProfileFormPasswordStub(true) } })

      await goToSecondStep()
      await goToThirdStep()
      await goToFourthStep()

      const { disabled, tooltip } = findButtonByText('Created').props()

      expect(disabled).toBe(false)
      expect(tooltip).toBe(null)
    })

    it('calls create profile frofile service', async () => {
      const createButton = findButtonByText('Created')

      createButton.vm.$emit('click')
      await wrapper.vm.$nextTick()

      expect(profileService.createProfile).toBeCalled()
      expect(profileService.resetProfilesParameters).toBeCalled()
      expect(profileService.resetSelectedProfileParameters).toBeCalled()
    })

    it('sends post message with created profile', async () => {
      const createButton = findButtonByText('Created')

      createButton.vm.$emit('click')
      await wrapper.vm.$nextTick()
      await flushPromises()

      expect(windowParentPostMessage).toBeCalledWith(
        expect.objectContaining({
          message: {
            type: profileMessageTypes.PROFILE_CREATED,
            payload: {
              profile: { colorScheme: mockSelectedColorScheme, publicKey: 'test' }
            }
          }
        })
      )
    })
  })
})
