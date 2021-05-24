import crypto from '@/crypto'

import { mnemonic, references } from './references'

describe('createProfile', () => {
  it('Can create a profile', () => {
    const profile = crypto.createProfile()
    expect(profile).toBe('mock')
  })
})
