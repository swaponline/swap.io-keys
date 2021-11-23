import { PublicKey, MnemonicPhrase, Seed, EncryptionParameters } from '@/types/encryptionParameters'
import { CryptoProfile } from '@/types/utils/cipher'

export type ProfileService = {
  getMnemonicPhrase: () => MnemonicPhrase
  getPublicKey: (seed: Seed) => PublicKey
  getSeedFromMnemonic: (mnemonicPhrase: MnemonicPhrase) => Promise<Seed>
  getColorScheme: (publicKey: PublicKey) => ColorScheme
  getProfilesParameters: () => ProfileParameters[]
  setProfilesParameters: (profileParameters: ProfileParameters[]) => void
  resetProfilesParameters: () => void
  getSelectedProfileParameters: () => ProfileParameters
  setSelectedProfileParameters: (selectedProfileParameters: ProfileParameters) => void
  resetSelectedProfileParameters: () => void
  createProfile: ({
    seed,
    publicKey,
    mnemonicPhrase
  }: EncryptionParameters) => Promise<{ cryptoProfile: CryptoProfile; shortKey: string }>
  saveProfileByShortKey: (cryptoProfile: CryptoProfile, shortKey: string) => void
}
