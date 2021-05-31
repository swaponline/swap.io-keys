/*
seed + password + HD Path => private key
private key => public key
public key => public address
*/

type TMnemonic = string
type TPrivateKey = string
type TPublicKey = string
type TAddress = string

type TNetworkName = string

type TProfile = {
  privateKey: TPrivateKey
  publicKey: TPublicKey
  address: TAddress
}

export enum ENetworkType {
  Mainnet = 'Mainnet',
  Testnet = 'Testnet'
}

export enum EPreset {
  BIP44 = 'BIP44',
  electrum = 'electrum'
}

export interface IAddProfileParams {
  mnemonic?: TMnemonic
}

export interface ICreateAddressesParams {
  coin: 'BTC' | 'LTC' | 'ETH'
  preset: EPreset
}

export interface INetwork {
  type: ENetworkType
  settings: {
    port: number
    magic: number
    messagePrefix: string
    base58prefix: {
      pubKeyHash: number
      scriptHash: number
      privateKeyWIF: number
      publicKeyBIP32: number
      privateKeyBIP32: number
    }
    bip44: {
      coinIndex: number
    }
  }
}

export interface ICoin {
  symbol: string
  name: string
  precision: number
  networks: {
    [key: string]: INetwork
  }
  profileFromMnemonic: ({ mnemonic: TMnemonic, netName: TNetworkName, index: number }) => TProfile
}
