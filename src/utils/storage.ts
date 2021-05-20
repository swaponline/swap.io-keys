export const setLanguage = lang => {
  window.localStorage.setItem('lang', lang)
}

export const getLanguage = () => {
  return window.localStorage.getItem('lang') || 'en'
}

export const getStorage = key => {
  return window.localStorage.getItem(key)
}

export const setStorage = (key, data) => {
  return window.localStorage.setItem(key, data)
}
