const storage = localStorage

export const setLanguage = lang => {
  storage.setItem('lang', JSON.stringify(lang))
}

export const getLanguage = () => {
  return storage.getItem('lang') || 'en'
}

export const getStorage = key => {
  const value = storage.getItem(key)
  return value && JSON.parse(value)
}

export const setStorage = (key, data) => {
  return storage.setItem(key, JSON.stringify(data))
}
