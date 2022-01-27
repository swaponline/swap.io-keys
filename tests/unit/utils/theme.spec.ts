import '../__mocks__/matchMedia.mock'
import { getUserSystemTheme } from '@/utils/theme'
import { LIGHT_THEME_KEY, DARK_THEME_KEY } from '@/constants/theme'

const PREFERS_COLOR_DARK = '(prefers-color-scheme: dark)'
const PREFERS_COLOR_LIGHT = '(prefers-color-scheme: light)'

describe('theme utils', () => {
  it('returns user dark theme', () => {
    const initialMatchMedia = window.matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        ...initialMatchMedia(query),
        matches: query === PREFERS_COLOR_DARK
      }
    })

    expect(getUserSystemTheme()).toBe(DARK_THEME_KEY)
  })

  it('return light theme', () => {
    const initialMatchMedia = window.matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        ...initialMatchMedia(query),
        matches: query === PREFERS_COLOR_LIGHT
      }
    })

    expect(getUserSystemTheme()).toBe(LIGHT_THEME_KEY)
  })
})
