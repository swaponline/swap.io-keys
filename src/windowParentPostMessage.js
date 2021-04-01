export default data => {
  if (window && window.parent && window.parent.postMessage) {
    console.warn(window.parent)
    window.parent.postMessage(data, 'http://localhost')
  }
}
