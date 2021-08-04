/* eslint-disable */
import BaseAdaptor from './adaptors/BaseAdaptor'
import EVMAdaptor from './adaptors/EVMAdaptor'
import UTXOAdaptor from './adaptors/UTXOAdaptor'
import networks from './networks'

let initedAdaptors: Array<BaseAdaptor> = []

function extendAdaptorConfig(options) {
  const {
    config,
    configsByName,
    cycleExtendDetector
  } = options

  if (config.parent) {
    if (cycleExtendDetector[config.parent]) {
      throw new Error(`Cycle extend config detected`)
    } else {
      const parentConfig = configsByName[config.parent]
      const extendedConfig = {
        ...parentConfig,
        ...config,
        parent: parentConfig.parent,
      }
      if (parentConfig.parent) {
        cycleExtendDetector[config.parent] = true
        return extendAdaptorConfig({
          config: extendedConfig,
          configsByName,
          cycleExtendDetector
        })
      } else {
        return extendedConfig
      }
    }
  } else {
    return config
  } 
}

function initNetworks(): Array<BaseAdaptor> {
  const configsByName = {}
  const configsByPriority = {}

console.log('>>>> networks', networks)
  networks.forEach((networkConfig: any) => {
    if (configsByName[networkConfig.slug]) {
      throw new Error(`Fail init network configs. Network with slug ${networkConfig.slug} already exists`)
    }
    if (configsByPriority[networkConfig.priority]) {
      console.warn(`Network with priority ${networkConfig.priority} already exists. Exists network ${configsByPriority[networkConfig.priority].slug}. Overwrite network ${networkConfig.slug}`)
    } else {
      configsByPriority[networkConfig.priority] = networkConfig
    }
    configsByName[networkConfig.slug] = networkConfig
  })

  const adaptors: Array<BaseAdaptor> = []

  networks.forEach((networkConfig) => {

    const extendedConfig = extendAdaptorConfig({
      config: networkConfig,
      configsByName,
      cycleExtendDetector: {},
    })
    // @ts-ignore
    extendedConfig.parent = networkConfig.parent

    switch(extendedConfig.type) {
      case `evm`:
        adaptors.push(new EVMAdaptor(extendedConfig))
        break
      case `utxo`:
        adaptors.push(new UTXOAdaptor(extendedConfig))
        break
    }
  })

  initedAdaptors = adaptors
  return adaptors
}

// @ts-ignore
window.initNetworks = initNetworks


export default initNetworks