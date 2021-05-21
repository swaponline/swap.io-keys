import { derivedRandom } from '@/utils/generators/randomizer'
import { Base64 } from 'js-base64'
import { UserColorTheme } from '@/utils/generators/background'

// eslint-disable-next-line import/prefer-default-export
export function getUserColorTheme(publicKey) {
  derivedRandom(publicKey)
  const { background, color } = new UserColorTheme().getColorTheme()
  const svgBase64 = `url("data:image/svg+xml;base64,${Base64.encode(background)}")`

  return {
    background: svgBase64,
    color
  }
}
