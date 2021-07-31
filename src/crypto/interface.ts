/* eslint-disable */
import initNetworks from './init'
import BaseAdaptor from './adaptors/BaseAdaptor'
import { getStorage, setStorage } from '@/utils/storage'
import { encryptData, toBuffer, decryptData, getSeedFromMnemonic, getPublicKey } from '@/utils/cipher'
import CryptoProfile from './profile'

type Seed = Buffer
type PublicKey = Buffer
type MnemonicPhrase = string[]

class CryptoInterface {
  private adaptors: Array<BaseAdaptor>

  constructor() {
    this.adaptors = initNetworks()
  }

  public getProfiles(): Record<string, unknown> {
    const profiles: Record<string, unknown> = getStorage('profiles') || {}
    return profiles
  }

  public async accessProfileByKey(profileKey: string, password: string): Promise<CryptoProfile|boolean> {
    return new Promise(async (resolve) => {
      const profiles: Record<string, unknown> = getStorage('profiles') || {}

      if (profiles[profileKey]) {
        const profileData = await this.accessProfile(profiles[profileKey], password)
        resolve(profileData)
      } else {
        resolve(false)
      }
    })
  }

  public async accessProfile(profile: unknown, password: string): Promise<CryptoProfile|boolean> {
    return new Promise(async (resolve) => {
      const profileSeed = await decryptData(profile, password)
      resolve(new CryptoProfile(toBuffer(profileSeed)))
    })
  }

  public async accessProfileByIndex(profileIndex: number, password: string): Promise<CryptoProfile|boolean> {
    return new Promise(async (resolve) => {
      const profiles: Record<string, unknown> = getStorage('profiles') || {}
      const profilesIndexes = Object.keys(profiles)
      if (profilesIndexes[profileIndex]) {
        const profileData = await this.accessProfile(profiles[profilesIndexes[profileIndex]], password)
        resolve(profileData)
      } else {
        resolve(false)
      }
    })
  }

  public async createProfileFromMnemonic(mnemonic: MnemonicPhrase, password: string): Promise<CryptoProfile> {
    const seed: Seed = await getSeedFromMnemonic(mnemonic)
    const publicKey: PublicKey = getPublicKey(seed)
    return await this.createProfile(seed, publicKey, password)
  }

  public async createProfile(seed: Seed, publicKey: PublicKey, password: string): Promise<CryptoProfile> {
    const newProfile = await encryptData(seed, publicKey, password)
    const profiles: Record<string, unknown> = getStorage('profiles') || {}
    const shortKey = publicKey.toString('hex').slice(0, 10)

    profiles[shortKey] = newProfile

    return new CryptoProfile(seed)
  }

  public getNetworkById(networkId: string): BaseAdaptor|false {
    const founded = this.adaptors.filter((adaptor: BaseAdaptor) => {
      return networkId.toLowerCase() === adaptor.getSymbol().toLowerCase()
    })
    return (founded.length) ? founded[0] : false
  }

  public getNetworkAdaptors(): Array<BaseAdaptor> {
    return this.adaptors
  }

  public getNetworkByCoin(coinslug: string): Array<BaseAdaptor> {
    return []
  }
}


export default CryptoInterface
