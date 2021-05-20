// import windowParentPostMessage from './windowParentPostMessage'

export default () => {
  window.addEventListener('message', event => {
    if (event.origin !== process.env.VUE_APP_HOME_URL) return
    const key = event.data.key || 'default'
    switch (key) {
      default: {
        console.warn(event.data)
      }
    }
  })
}
