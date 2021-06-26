import BaseAdaptor from './adaptors/BaseAdaptor'
import EVMAdaptor from './adaptors/EVMAdaptor'
import UTXOAdaptor from './adaptors/UTXOAdaptor'
import networks from './networks'

let initedAdaptors: Array<BaseAdaptor> = []

function initNetworks(): Array<BaseAdaptor> {
  const adaptors: Array<BaseAdaptor> = []

  networks.forEach((networkConfig) => {
    switch(networkConfig.type) {
      case `evm`:
        adaptors.push(new EVMAdaptor(networkConfig))
        break
      case `utxo`:
        adaptors.push(new UTXOAdaptor(networkConfig))
        break
    }
  })

  initedAdaptors = adaptors
  return adaptors
}

// @ts-ignore
window.initNetworks = initNetworks


export default initNetworks