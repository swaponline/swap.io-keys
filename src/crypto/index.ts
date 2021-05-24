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

export const coins = []

export const createProfile: () => TProfile = () => {
  return {
    // mock
    privateKey: 'L2opBasCx47tgK9h4dP7r9kVRCjyBu7Z47fByBuamYwHYbzbP42g',
    publicKey: '029f7b0a848819c4e19c2282572a821b0a0dc265128f515af292fc84f81c4b1a3f',
    address: '1P8HdnAAFkJDbbKnfV3721KS9cVyX59x5j'
  }
}

export enum ENetworkType {
  Mainnet = 'Mainnet',
  Testnet = 'Testnet'
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
  profileFromMnemonic: (mnemonic: TMnemonic, netName: TNetworkName) => TProfile
}
