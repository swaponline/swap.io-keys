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

  networks.forEach((networkConfig: any) => {
    if (configsByName[networkConfig.symbol]) {
      throw new Error(`Fail init network configs. Network with symbol ${networkConfig.symbol} already exists`)
    }
    if (configsByPriority[networkConfig.priority]) {
      console.warn(`Network with priority ${networkConfig.priority} already exists. Exists network ${configsByPriority[networkConfig.priority].symbol}. Overwrite network ${networkConfig.symbol}`)
    } else {
      configsByPriority[networkConfig.priority] = networkConfig
    }
    configsByName[networkConfig.symbol] = networkConfig
  })

  const adaptors: Array<BaseAdaptor> = []

  networks.forEach((networkConfig) => {
    console.log('>>>> source config', networkConfig)
    const extendedConfig = extendAdaptorConfig({
      config: networkConfig,
      configsByName,
      cycleExtendDetector: {},
    })
    // @ts-ignore
    extendedConfig.parent = networkConfig.parent
    console.log('>>>> extendedConfig', extendedConfig)
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