import * as bitcoin from 'bitcoinjs-lib'

const DEFAULT_CIFHER_PARAMS = {
  algoName: 'PBKDF2',
  hash: 'SHA-256',
  iterations: 250000,
  cipherName: 'AES-GCM',
  bits: 256
}

// Функции трансформаторы
const base64ToBuf = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(null))
const buffToBase64 = buff => btoa(String.fromCharCode.apply(null, buff))
// Для сохранения соли и iv в сторадже и возвращения к Uint8Array подобному виду
const hexToBuff = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
const buffToHex = buffer =>
  Array.prototype.map.call(new Uint8Array(buffer), x => `00${x.toString(16)}`.slice(-2)).join('')

function getPasswordKey(password) {
  return window.crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'])
}

/**
 * Получить публичный ключ, с помощью него записываем в сторадж
 * @param {string} seed
 * @returns
 */
const getPublicKey = seed => bitcoin.bip32.fromSeed(seed).publicKey.toString('hex')

/**
 * Для получения секретного ключа из главного ключа.
 */
function deriveKey(passwordKey, salt, keyUsage, params) {
  return window.crypto.subtle.deriveKey(
    {
      name: params.algoName,
      salt,
      iterations: params.iterations,
      hash: params.hash
    },
    passwordKey,
    {
      name: params.cipherName,
      length: params.bits
    },
    false,
    keyUsage
  )
}

/**
 * Шифровальщик seed строки
 * @param {string} seed seed строка, получается из мнемоник фарзы
 * @param {string} password пароль, с помощью него шифруется seed
 * @param {} params параметры для шифрования, можно менять частично
 * @returns
 */
export async function encryptData(seed, password, userParams = {}) {
  try {
    const params = { ...DEFAULT_CIFHER_PARAMS, ...userParams }

    const publicKey = getPublicKey(seed)

    const salt = window.crypto.getRandomValues(new Uint8Array(16))
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    const passwordKey = await getPasswordKey(password)
    const aesKey = await deriveKey(passwordKey, salt, ['encrypt'], params)
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: params.cipherName,
        iv
      },
      aesKey,
      new TextEncoder().encode(seed)
    )

    const encryptedContentArr = new Uint8Array(encryptedContent)
    const buff = new Uint8Array(encryptedContentArr.byteLength)
    buff.set(encryptedContentArr)

    return {
      algo: {
        name: params.algoName,
        iterations: params.iterations,
        hash: params.hash,
        salt: buffToHex(salt)
      },
      cipher: {
        name: params.cipherName,
        bits: params.bits,
        iv: buffToHex(iv),
        text: buffToBase64(buff)
      },
      publicKey
    }
  } catch (e) {
    console.log(`Error - ${e}`)
    return ''
  }
}

/**
 * Расшифровывает seed строку с помощью пароля
 * @param {*} encryptedData ОбЪект, вовзращаемый из стораджа по части publicKey
 * @param {*} password пароль для расшифровки
 * @returns seed строка, используется для подтверждения операций
 */
export async function decryptData(encryptedData, password) {
  try {
    const params = {
      algoName: encryptedData.algo.name,
      hash: encryptedData.algo.hash,
      iterations: encryptedData.algo.iterations,
      cipherName: encryptedData.cipher.name,
      bits: encryptedData.cipher.bits
    }
    const encryptedDataBuff = base64ToBuf(encryptedData.cipher.text)
    const salt = hexToBuff(encryptedData.algo.salt)
    const iv = hexToBuff(encryptedData.cipher.iv)
    const data = encryptedDataBuff
    const passwordKey = await getPasswordKey(password)
    const aesKey = await deriveKey(passwordKey, salt, ['decrypt'], params)
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: params.cipherName,
        iv
      },
      aesKey,
      data
    )
    return new TextDecoder().decode(decryptedContent)
  } catch (e) {
    console.log(`Error - ${e}`)
    return ''
  }
}
