import { THEME_KEY } from '@/constants/theme'
import { iframeMessageTypes } from '@/constants/messageTypes'
import { profileService, getDefaultProfileParameters } from '@/services/profile'
import { setStorage } from './utils/storage'

export const messageHandler = (): Promise<boolean> => {
  return new Promise(resolve => {
    window.addEventListener('message', event => {
      if (event.origin !== process.env.VUE_APP_HOME_URL) return
      if (!event.data.message) return

      const { type, payload } = event.data.message

      switch (type) {
        case iframeMessageTypes.SET_DEFAULT_STATE_IFRAME:
          setStorage(THEME_KEY, payload.theme)

          if (payload.needSetIframeState) {
            const defaultProfileParameters = getDefaultProfileParameters()

            profileService.setProfilesParameters([])
            profileService.setSelectedProfileParameters(defaultProfileParameters)
          }
          resolve(true)
          break
        default: {
          // ! implementation will appear in the future
        }
      }
    })
  })
}
