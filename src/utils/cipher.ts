import { payments, bip32 } from 'bitcoinjs-lib'
import { generateMnemonic, mnemonicToSeed } from 'bip39'
import {
  DefaultCipherParams,
  DefaultDerivationParams,
  MnemonicPhrase,
  PublicKey,
  Seed,
  CryptoProfile
} from '@/types/cipher'

// default params
const DEFAULT_CIPHER_PARAMS: DefaultCipherParams = {
  algoName: 'PBKDF2',
  hash: 'SHA-256',
  iterations: 250000,
  cipherName: 'AES-GCM',
  bits: 256
}

const DEFAULT_DERIVATION_PARAMS: DefaultDerivationParams = {
  typeCurrency: 0,
  account: 0,
  change: 0,
  index: 0
}

export const QUANTITY_MNEMONIC = 4

// Функции трансформаторы
const base64ToBuf = (b64: string) => Uint8Array.from(atob(b64), c => c.charCodeAt(0))

const buffToBase64 = buff => btoa(String.fromCharCode.apply(null, buff))

// Для сохранения соли и iv в сторадже и возвращения к Uint8Array подобному виду
const hexToBuff = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

const buffToHex = (buffer: Uint8Array) =>
  Array.prototype.map.call(new Uint8Array(buffer), x => `00${x.toString(16)}`.slice(-2)).join('')

function getAddress(node, network) {
  return payments.p2pkh({ pubkey: node.publicKey, network }).address
}

function getPasswordKey(password: string) {
  return window.crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'])
}

export function getMnemonicPhrase(): MnemonicPhrase {
  return generateMnemonic(256).split(' ')
}

export async function getMnemonicToSeed(mnemonicPhrase: MnemonicPhrase): Promise<Buffer> {
  const seed = await mnemonicToSeed(mnemonicPhrase.join(''))
  return seed
}

// Получить публичный ключ, с помощью него записываем в сторадж
export const getPublicKey = (seed: Buffer): Buffer => {
  return bip32.fromSeed(seed).publicKey
}

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
 * Шифровальщик seed строки с помощью пароля
 * @param {Buffer} seed seed буффер, получается из мнемоник фразы
 * @param {string} password пароль, с помощью него шифруется seed
 * @param {} params параметры для шифрования, можно менять частично
 * @returns Объект с зашифрованной
 */
export async function encryptData(
  seed: Seed,
  publicKey: PublicKey,
  password: string,
  userParams = {}
): Promise<CryptoProfile> {
  const params = { ...DEFAULT_CIPHER_PARAMS, ...userParams }

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
    // new TextEncoder().encode(seed)
    seed
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
    publicKey: publicKey.toString('hex')
  }
}

/**
 * Расшифровывает seed строку с помощью пароля
 * @param {*} encryptedData ОбЪект, вовзращаемый из стораджа по части publicKey
 * @param {*} password пароль для расшифровки
 * @returns {string} seed
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
/**
 * Функция создания кошелька
 * Подробнее про стандарт bip44, можно прочитать тут(https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
 * @param {string} seed
 * @param {object} params объект со следующими параметрами пути:
 * @param {number} params.typeCurrency тип криптовалюты(для каждой уникальный свой номер)
 * https://github.com/satoshilabs/slips/blob/master/slip-0044.md номера валют
 * @param {number} params.account Этот уровень разделяет пространство ключей на независимые идентификаторы
 * пользователей, поэтому кошелек никогда не смешивает монеты из разных учетных записей.
 * Но вообще 1 сид 1 аккаунт, может быть в константу вынести будет надо
 * @param {number} params.change Константа 0 используется для внешней цепочки,
 * а константа 1 для внутренней цепочки (также известной как адреса изменения).
 * @param {number} params.index Адреса нумеруются, начиная с индекса 0, в порядке возрастания.
 * @param {bitcoin.Network} network сеть
 * @returns возвращает номер кошелька
 */

export function createAddress(seed, userParams = {}, network = undefined) {
  const params = { ...DEFAULT_DERIVATION_PARAMS, ...userParams }
  const root = bip32.fromSeed(Buffer.from(seed, 'hex'), network)
  const child = root
    .deriveHardened(44)
    .deriveHardened(params.typeCurrency)
    .deriveHardened(params.account)
    .derive(params.change)
    .derive(params.index)
  return getAddress(child, network)
}
