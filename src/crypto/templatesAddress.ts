/* eslint-disable */

import handshakeDefault from './templates/address/handshake/default'
import tronDefault from './templates/address/tron/default'
import stellarDefault from './templates/address/stellar/default'
import polkadotDefault from './templates/address/polkadot/default'
import kusamaDefault from './templates/address/kusama/default'
import cardanoDefault from './templates/address/cardano/default'
import solanaDefault from './templates/address/solana/default' 


const templates = {
  'handshake/default': handshakeDefault,
  'tron/default': tronDefault,
  'stellar/default': stellarDefault,
  'polkadot/default': polkadotDefault,
  'kusama/default': kusamaDefault,
  'cardano/default': cardanoDefault,
  'solana/default': solanaDefault,
}

export default templates