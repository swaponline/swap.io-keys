import { derivedRandom } from '@/utils/generators/randomizer'
import { Base64 } from 'js-base64'
import { UserColorTheme, ColorTheme } from '@/utils/generators/background'

// eslint-disable-next-line import/prefer-default-export
export function getUserColorTheme(publicKey: string): ColorTheme {
  derivedRandom(publicKey)
  const { background, color, colorSelection } = new UserColorTheme().getColorTheme()
  const svgBase64 = `url("data:image/svg+xml;base64,${Base64.encode(background)}")`
  // const optimizedSVGDataURI = miniSvgDataUri(background)
  return {
    background: svgBase64,
    color,
    colorSelection
  }
}
