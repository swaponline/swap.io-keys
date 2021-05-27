const storage = localStorage

// TODO: data structure validation
export const getStorage = <T>(key: string): T => {
  const value = storage.getItem(key)
  return value && JSON.parse(value)
}

export const setStorage = <T>(key: string, data: T): void => {
  return storage.setItem(key, JSON.stringify(data))
}

export const setLanguage = (lang: string): void => {
  setStorage('lang', lang)
}

export const getLanguage = (): string => {
  return getStorage('lang') || 'en'
}
