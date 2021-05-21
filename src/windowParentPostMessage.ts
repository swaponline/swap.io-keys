export default data => {
  if (!(window && window.parent && typeof window.parent.postMessage === 'function')) {
    throw new Error('No `window.parent.postMessage`')
  }
  if (!(process && process.env && process.env.VUE_APP_HOME_URL)) {
    throw new Error('No `process.env.VUE_APP_HOME_URL`')
  }
  window.parent.postMessage(data, process.env.VUE_APP_HOME_URL)
}
