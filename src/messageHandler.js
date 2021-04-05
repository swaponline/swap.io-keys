export default vue => {
  window.addEventListener('message', event => {
    if (event.origin !== 'http://localhost') return
    switch (event.data.key) {
      case 'profile': {
        console.warn(event.data, vue)
        break
      }
      default: {
        console.warn(event.data, vue)
      }
    }
  })
}
