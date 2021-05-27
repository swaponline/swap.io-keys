const homeUrl = process && process.env && process.env.VUE_APP_HOME_URL

if (!homeUrl) {
  console.warn(`Environment variable 'VUE_APP_HOME_URL' was not set`)
}

export default data => {
  if (!(window && window.parent && typeof window.parent.postMessage === 'function')) {
    throw new Error('No `window.parent.postMessage`')
  }
  if (homeUrl) {
    window.parent.postMessage(data, homeUrl)
  } else {
    console.log(`📤 (mocked) ${JSON.stringify(data)}`)
  }
}
