import { THEME_KEY } from '@/constants/theme'
import { SET_APP_THEME } from '@/constants/createProfile'
import { setStorage } from './utils/storage'

export const messageHandler = (): Promise<boolean> => {
  return new Promise(resolve => {
    window.addEventListener('message', event => {
      if (event.origin !== process.env.VUE_APP_HOME_URL) return
      const { type, payload } = event.data.message
      switch (type) {
        case SET_APP_THEME:
          setStorage(THEME_KEY, payload.theme)
          resolve(true)
          break
        default: {
          // ! implementation will appear in the future
        }
      }
    })
  })
}
