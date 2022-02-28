import { messageHandler } from '@/messageHandler'
import { THEME_KEY } from '@/constants/theme'
import { iframeMessageTypes } from '@/constants/messageTypes'
import * as storageService from '@/utils/storage'
import { profileService, getDefaultProfileParameters } from '@/services/profile'
import { injectOriginToBlankPostMessages } from './__helpers__/postMessage'
import flushPromises from './__helpers__/flushPromises'

injectOriginToBlankPostMessages(window, 'http://localhost')
jest.spyOn(storageService, 'setStorage')
jest.spyOn(profileService, 'setProfilesParameters')
jest.spyOn(profileService, 'setSelectedProfileParameters')

const DARK_THEME = 'dark'
const DEFAULT_MESSAGE = {
  message: {
    type: iframeMessageTypes.SET_DEFAULT_STATE_IFRAME,
    payload: {
      needSetIframeState: true,
      theme: DARK_THEME
    }
  }
}

describe('message handler', () => {
  it('sets theme to storage', async () => {
    messageHandler()
    window.postMessage(DEFAULT_MESSAGE, '*')
    await flushPromises()

    expect(storageService.setStorage).toBeCalledWith(THEME_KEY, DARK_THEME)
  })

  it('sets iframe state', async () => {
    messageHandler()
    window.postMessage(DEFAULT_MESSAGE, '*')
    await flushPromises()

    expect(profileService.setProfilesParameters).toBeCalledWith([])
    expect(profileService.setSelectedProfileParameters).toBeCalledWith(getDefaultProfileParameters())
  })

  it('resolves promise if a message is received', async () => {
    const results = messageHandler()
    window.postMessage(DEFAULT_MESSAGE, '*')
    await flushPromises()

    expect(await results).toBe(true)
  })
})
