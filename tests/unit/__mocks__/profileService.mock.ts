export const TEST_CRYPTO_PROFILE = {
  algo: {
    hash: 'SHA-256',
    iterations: 250000,
    name: 'PBKDF2',
    salt: '40e00f66ffe6fb8d10ac35e03e53cc06'
  },
  cipher: {
    bits: 256,
    iv: '4c48d7b3a26b2f37154b5763',
    name: 'AES-GCM',
    text:
      // eslint-disable-next-line vue/max-len
      'Pe1cTBvNeYs2zW8tdX9+cCpEiyFAlO1Sm8VECMJ4W7fD5HiREGhyGrdmxLami/miHwO1W7i4eg8dfK6lZgVnEZZzcInzQMRIVuHQbV/QT2IbcZOMnCm5wwc3/DJ+fWko4jpzKPr3y8uiVKicFkQIAurBxMm3INfDNPNw7EUuwwooRMaPwWKOSAaLXe6s4+E4VqICSZhGR7wnHphqaQc6zx+j6NIFmQtLO4Mg4NjurZH4Fm/ICkFyVKBfZfOD6lWuPQeGnPuQXJYXLSAsKqitK5zmy3PAkf2BlYpv8m5IK7zfxHocSjjNrOCdJRAQzyfapaFu1nyunKDfo0dYSJnKytjWGgMfYc8OLyq0+Ajkv0I91zU/TDigX05rc7UEFsxSMZZ76ctS5j0N/g=='
  },
  publicKey: '029b334fcb4caa969840b5c04990a2bd74df210254f6be49a0d9695f3be421db06'
}

export const DEFAULT_PROFILE_PARAMETERS = {
  colorScheme: {
    background: '',
    color: '',
    colorForDarkTheme: '',
    selectionColor: ''
  },
  encryptionParameters: {
    password: '',
    mnemonicPhrase: [],
    publicKey: null,
    seed: null
  }
}

export const profile1 = {
  colorScheme: {
    background: 'Test',
    color: 'Test',
    colorForDarkTheme: 'Test',
    selectionColor: 'Test'
  },
  encryptionParameters: {
    password: 'Test',
    mnemonicPhrase: [],
    publicKey: null,
    seed: null
  }
}
export const profile2 = {
  colorScheme: {
    background: 'Test2',
    color: 'Test2',
    colorForDarkTheme: 'Test2',
    selectionColor: 'Test2'
  },
  encryptionParameters: {
    password: 'Test2',
    mnemonicPhrase: [],
    publicKey: null,
    seed: null
  }
}

export const MOCK_MNEMONIC_PHRASE = [
  'lobster',
  'truth',
  'rare',
  'limb',
  'coyote',
  'often',
  'film',
  'avoid',
  'zebra',
  'man',
  'indicate',
  'broken',
  'crystal',
  'oxygen',
  'verb',
  'village',
  'promote',
  'story',
  'wait',
  'coffee',
  'mention',
  'fox',
  'forward',
  'medal'
]
export const PUBLIC_KEY = '029b334fcb4caa969840b5c04990a2bd74df210254f6be49a0d9695f3be421db06'
export const SHORT_PUBLIC_KEY = '029b334fcb'
