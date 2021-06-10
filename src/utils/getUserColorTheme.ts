import { derivedRandom } from '@/utils/generators/randomizer'
import { UserColorTheme, ColorTheme } from '@/utils/generators/background'

// eslint-disable-next-line import/prefer-default-export
export function getUserColorTheme(publicKey: string): ColorTheme {
  derivedRandom(publicKey)
  const { background, color, selectionColor } = new UserColorTheme().getColorTheme()
  return {
    background,
    color,
    selectionColor
  }
}
