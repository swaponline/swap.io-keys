import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import { generateColor, getGradient } from '@/utils/generators'
import { encryptData } from './utils/chifer'
import { getStorage, setStorage } from './utils/storage'
import windowParentPostMessage from './windowParentPostMessage'

function getCards() {
  const list = []
  for (let i = 0; i < 4; i += 1) {
    const wordList = generateMnemonic(256).split(' ')
    const color = generateColor()
    list.splice(i, 1, {
      background: getGradient(color),
      color,
      wordList
    })
  }
  return list
}

// надо подумать, возвращать профиля или новый профиль только
async function createProfile(mnemonic, password) {
  const seed = mnemonicToSeedSync(mnemonic)
  const newProfile = await encryptData(seed, password)
  const profiles = JSON.parse(getStorage('profiles')) || {}
  profiles[newProfile.publicKey.slice(0, 10)] = newProfile
  setStorage('profiles', JSON.stringify(profiles))
  return newProfile
}

export default () => {
  window.addEventListener('message', event => {
    if (event.origin !== 'http://localhost') return
    const key = event.data.key || 'default'
    switch (key) {
      case 'getColorCards': {
        windowParentPostMessage({ key, list: getCards() })
        break
      }
      case 'secretPhrase': {
        if (event.data.mnemonic && event.data.password) {
          createProfile(event.data.mnemonic, event.data.password).then(profile => {
            windowParentPostMessage({ key, profile })
          })
        }
        break
      }
      default: {
        console.warn(event.data)
      }
    }
  })
}
