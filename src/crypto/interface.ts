import initNetworks from './init'
import BaseAdaptor from './adaptors/BaseAdaptor'
import { getStorage, setStorage } from '@/utils/storage'
import { encryptData, decryptData, getSeedFromMnemonic, getPublicKey } from '@/utils/cipher'
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

  public async accessProfile(profileIndex: number, password: string): Promise<CryptoProfile|boolean> {
    const profiles: Record<string, unknown> = getStorage('profiles') || {}
    const profilesIndexes = Object.keys(profiles)
    if (profilesIndexes[profileIndex]) {
      const profileData = await decryptData(profiles[profilesIndexes[profileIndex]], password)
      console.log('>>>> profileData', profileData)
    }
    return new CryptoProfile()
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

    setStorage('profiles', profiles)
    return new CryptoProfile()
  }

  public getNetworkAdaptors(): Array<BaseAdaptor> {
    return this.adaptors
  }

  public getNetworkByCoin(coinslug: string): Array<BaseAdaptor> {
    return []
  }
}


export default CryptoInterface
