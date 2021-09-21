import { LIGHT_THEME_KEY, DARK_THEME_KEY } from '@/constants/theme'
import { LightThemeKey, DarkThemeKey } from '@/types/appThemes'

export function getUserSystemTheme(): LightThemeKey | DarkThemeKey {
  const isLightSystemTheme = window.matchMedia('(prefers-color-scheme: light)').matches
  const isDarkSystemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (isDarkSystemTheme) return DARK_THEME_KEY
  if (isLightSystemTheme) return LIGHT_THEME_KEY

  return LIGHT_THEME_KEY
}
