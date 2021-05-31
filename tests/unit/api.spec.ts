import coins from '@/crypto/coins'

import { mnemonic, references } from './references'

describe('createProfile', () => {
  it('Has references for the test', () => {
    expect(references.length).toBe(2)
  })

  references.forEach(refItem => {
    it(`Can create a profile: ${refItem.coin} - ${refItem.network}`, () => {
      const coin = coins[refItem.coin]
      // const network = coin.networks[refItem.network]
      const profile0 = coin.profileFromMnemonic({
        mnemonic,
        netName: refItem.network,
        index: 0
      })
      const profile1 = coin.profileFromMnemonic({
        mnemonic,
        netName: refItem.network,
        index: 1
      })

      expect(profile0).toStrictEqual(refItem.derived[0])
      expect(profile1).toStrictEqual(refItem.derived[1])
    })
  })
})
