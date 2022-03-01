export function injectOriginToBlankPostMessages(window: Window, origin: string): (MessageEvent) => void {
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

  window.addEventListener('message', messageHandler)

  return messageHandler
}
