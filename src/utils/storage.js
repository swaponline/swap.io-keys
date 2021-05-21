const storage = localStorage

export const setLanguage = lang => {
  storage.setItem('lang', JSON.stringify(lang))
}

export const getLanguage = () => {
  return JSON.parse(storage.getItem('lang')) || 'en'
}

export const getStorage = key => {
  return JSON.parse(storage.getItem(key))
}

export const setStorage = (key, data) => {
  return storage.setItem(key, JSON.stringify(data))
}
