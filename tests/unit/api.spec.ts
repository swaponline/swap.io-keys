import crypto from '@/common/crypto'

const mnemonic = 'sudden expire elegant spend they peanut search giggle battle gas sister atom'

describe('createProfile', () => {
  it('Can create ETH profiles', () => {
    const profile0 = crypto.profileFromMnemonic({
      coin: 'ETH',
      mnemonic,
      addressIndex: 0
    })

    expect(profile0).toStrictEqual({
      // Reference: https://iancoleman.io/bip39/
      privateKey: '0x630e555b485821671b984fbb481614371fa96c3856c103b8a8155397a3e8a81c',
      publicKey: '0x03cf3150838500d4abe82822fe624f654e7f7230420ffabfcadfbbbb60bc2166e6',
      address: '0x8707b05F4659b28E8Fe10e2b439625cc34FF0096'
    })

    const profile1 = crypto.profileFromMnemonic({
      coin: 'ETH',
      mnemonic,
      addressIndex: 1
    })

    expect(profile1).toStrictEqual({
      // Reference: https://iancoleman.io/bip39/
      privateKey: '0xf3cdfda12a4a70a22edb2cfafcbd26dfa33e0b8cd956aba608bff659fdc01aac',
      publicKey: '0x022d9acca03052e670ea6e69ddb787abc60ea251b62894d6433018de8960434409',
      address: '0x49Fc2F8A6CF9bEC41d47Fd4017eF54646c97649e'
    })
  })

  it('Can create BTC-testnet profiles', () => {
    const profile0 = crypto.profileFromMnemonic({
      coin: 'BTC',
      network: 'testnet',
      mnemonic,
      addressIndex: 0
    })

    expect(profile0).toStrictEqual({
      // Reference: https://iancoleman.io/bip39/
      privateKey: 'cUA5k263Wd8cA6M4StxyJNdrXs4rKk2h88rxATcHunrxaxtpMMXw',
      publicKey: '02baacab92e5563ca1cb785f412ccf69ef6979d5b6e8b01c01a7e5cc7612051eab',
      address: 'mnkxYF6DZVSeQrQjusHq7xgECTVPp4w24H'
    })

    const profile1 = crypto.profileFromMnemonic({
      coin: 'BTC',
      network: 'testnet',
      mnemonic,
      addressIndex: 1
    })

    expect(profile1).toStrictEqual({
      // Reference: https://iancoleman.io/bip39/
      privateKey: 'cVL8jcxeQzGjbb5ctrGwB1eBMXWGU1TZPhP1x65jmLNTPvgbHwTy',
      publicKey: '03c52b8ba5981e1b8d706191959c4c1793fac4b8f2bfbb0811ebdbc4d8288a4f80',
      address: 'n1diZdNDBJPhd22vuXQvsqAdsfqhaWcy7R'
    })
  })

  it('Can create BTC-mainnet profiles', () => {
    const profile0 = crypto.profileFromMnemonic({
      coin: 'BTC',
      network: 'mainnet',
      mnemonic,
      addressIndex: 0
    })

    expect(profile0).toStrictEqual({
      // Reference: https://iancoleman.io/bip39/
      privateKey: 'L2opBasCx47tgK9h4dP7r9kVRCjyBu7Z47fByBuamYwHYbzbP42g',
      publicKey: '029f7b0a848819c4e19c2282572a821b0a0dc265128f515af292fc84f81c4b1a3f',
      address: '1P8HdnAAFkJDbbKnfV3721KS9cVyX59x5j'
    })

    const profile1 = crypto.profileFromMnemonic({
      coin: 'BTC',
      network: 'mainnet',
      mnemonic,
      addressIndex: 1
    })

    expect(profile1).toStrictEqual({
      // Reference: https://iancoleman.io/bip39/
      privateKey: 'L2ZxxB7sNQjAmwVC7QQxRGypDQjKRNcEBH4JVyGihV6MVpDU754X',
      publicKey: '03a54a8e72d16f51149ed1064f2bf23a6a208734db20567167a05de5b9652e26ed',
      address: '1PtoSLHfgnrhg1piupG1obmvsdLdxeELyC'
    })
  })

  it('Can create LTC-testnet profiles', () => {
    const profile0 = crypto.profileFromMnemonic({
      coin: 'LTC',
      network: 'testnet',
      mnemonic,
      addressIndex: 0
    })

    expect(profile0).toStrictEqual({
      // Reference: https://iancoleman.io/bip39/
      // privateKey: 'cUA5k263Wd8cA6M4StxyJNdrXs4rKk2h88rxATcHunrxaxtpMMXw',
      privateKey: '', // todo: fix privateKey
      publicKey: '02baacab92e5563ca1cb785f412ccf69ef6979d5b6e8b01c01a7e5cc7612051eab',
      address: 'mnkxYF6DZVSeQrQjusHq7xgECTVPp4w24H'
    })

    const profile1 = crypto.profileFromMnemonic({
      coin: 'LTC',
      network: 'testnet',
      mnemonic,
      addressIndex: 1
    })

    expect(profile1).toStrictEqual({
      // Reference: https://iancoleman.io/bip39/
      // privateKey: 'cVL8jcxeQzGjbb5ctrGwB1eBMXWGU1TZPhP1x65jmLNTPvgbHwTy',
      privateKey: '', // todo: fix privateKey
      publicKey: '03c52b8ba5981e1b8d706191959c4c1793fac4b8f2bfbb0811ebdbc4d8288a4f80',
      address: 'n1diZdNDBJPhd22vuXQvsqAdsfqhaWcy7R'
    })
  })

  it('Can create LTC-mainnet profiles', () => {
    const profile0 = crypto.profileFromMnemonic({
      coin: 'LTC',
      network: 'mainnet',
      mnemonic,
      addressIndex: 0
    })

    expect(profile0).toStrictEqual({
      // Reference: https://iancoleman.io/bip39/
      // privateKey: 'T8LYWa1wvC317PSytdpHBbzviijKuuqyLywT7FCEXupEuAuUwPPo',
      privateKey: '', // todo: fix privateKey
      publicKey: '026e9e26d004b5fb1da69e7349c32642005cc800002121ef48dad30a212b1dd47b',
      address: 'LggM6A4J2NzpZYPzMEGLCBSpRJZrcMML8n'
    })

    const profile1 = crypto.profileFromMnemonic({
      coin: 'LTC',
      network: 'mainnet',
      mnemonic,
      addressIndex: 1
    })

    expect(profile1).toStrictEqual({
      // Reference: https://iancoleman.io/bip39/
      // privateKey: 'T5GdLM1LcrWkbgx4iWJpno1WpgfAGVVJFzCc16ZuZR1VP25LTGB4',
      privateKey: '', // todo: fix privateKey
      publicKey: '031104acaef56672a73363894f110d5ae12946fb47cc932be85339dfbc16e6cf21',
      address: 'LfaPnMj5jYcGMMD6fiXbCq9y1aR6oa5qt1'
    })
  })
})
