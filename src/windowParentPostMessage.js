export default data => {
  if (window && window.parent && window.parent.postMessage) {
    window.parent.postMessage(data, 'http://localhost')
  }
}
