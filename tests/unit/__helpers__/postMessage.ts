export function injectOriginToBlankPostMessages(window: Window, origin: string): () => void {
  function messageHandler(event: MessageEvent) {
    if (event.origin === '') {
      event.stopImmediatePropagation()
      const eventWithOrigin: MessageEvent = new MessageEvent('message', {
        data: event.data,
        origin
      })
      window.dispatchEvent(eventWithOrigin)
    }
  }

  function removeMessageListener() {
    window.removeEventListener('message', messageHandler)
  }

  window.addEventListener('message', messageHandler)

  return removeMessageListener
}
