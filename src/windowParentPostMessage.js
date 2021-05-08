export default data => {
  if (window && window.parent && window.parent.postMessage) {
    window.parent.postMessage(data, process.env.VUE_APP_HOME_URL)
  }
}
