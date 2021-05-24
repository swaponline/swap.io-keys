import BTC from './BTC'
import LTC from './LTC'
import ETH from './ETH'

const coins = {
  [BTC.symbol]: BTC,
  [LTC.symbol]: LTC,
  [ETH.symbol]: ETH
}

export default coins
