import { PublicKey, MnemonicPhrase, Seed, EncryptionParameters } from '@/types/encryptionParameters'
import { CryptoProfile } from '@/types/utils/cipher'

export type ProfileService = {
  getMnemonicPhrase: () => MnemonicPhrase
  getPublicKey: (seed: Seed) => PublicKey
  getSeedFromMnemonic: (mnemonicPhrase: MnemonicPhrase) => Promise<Seed>
  getUserColorScheme: (publicKey: PublicKey) => ColorScheme
  getProfilesParameters: () => ProfileParameters[]
  setProfilesParameters: (profileParameters: ProfileParameters[]) => void
  getSelectedProfileParameters: () => ProfileParameters
  resetProfilesParameters: () => void
  setSelectedProfileParameters: (selectedProfileParameters: ProfileParameters) => void
  resetSelectedProfileParameters: () => void
  createProfile: ({
    seed,
    publicKey,
    mnemonicPhrase,
    password
  }: EncryptionParameters) => Promise<{ cryptoProfile: CryptoProfile; shortKey: string }>
  saveProfileByShortKey: (cryptoProfile: CryptoProfile, shortKey: string) => void
}
