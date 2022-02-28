export function injectOriginToBlankPostMessages(window: Window, origin: string): void {
  window.addEventListener('message', (event: MessageEvent) => {
    debugger
    if (event.origin === '') {
      event.stopImmediatePropagation()
      const eventWithOrigin: MessageEvent = new MessageEvent('message', {
        data: event.data,
        origin
      })
      window.dispatchEvent(eventWithOrigin)
    }
  })
}
