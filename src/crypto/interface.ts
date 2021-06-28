import initNetworks from './init'
import BaseAdaptor from './adaptors/BaseAdaptor'

class CryptoInterface {
  private adaptors: Array<BaseAdaptor>

  constructor() {
    this.adaptors = initNetworks()
  }
}

export default CryptoInterface
