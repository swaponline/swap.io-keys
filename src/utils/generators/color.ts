import { randomInteger } from './randomizer'

export type ColorHex = string
export type ColorRGB = number[]
type DimmingPercentage = number

function isTestHex(hex: ColorHex): boolean {
  return /^#([a-f0-9]{3}){1,2}$/.test(hex)
}

function convertHex(hex: ColorHex): { r: number; g: number; b: number } {
  if (hex && isTestHex(hex)) {
    const tempHex = hex.replace('#', '')
    const r = parseInt(tempHex.substring(0, 2), 16)
    const g = parseInt(tempHex.substring(2, 4), 16)
    const b = parseInt(tempHex.substring(4, 6), 16)

    return { r, g, b }
  }

  throw new Error(`Wrong hex ${hex}`)
}

function hexToRGB(hex: ColorHex): ColorRGB {
  const { r, g, b } = convertHex(hex)
  return [r, g, b]
}

function rgbToHex(rgb: ColorRGB): string[] {
  return rgb.map(int => {
    const str = String(int)
    const strBase16 = parseInt(str, 10).toString(16) // Convert to a base16 string
    return strBase16.length === 1 ? `0${strBase16}` : strBase16 // Add zero if we get only one character
  })
}

// ! Creates an array of 1535 colors
function generateColors(): string[] {
  const colors: ColorHex[] = []
  for (let i = 0; i <= 255; i += 1) {
    colors.push(`#${rgbToHex([255, i, 0]).join('')}`)
  }
  for (let i = 255; i >= 0; i -= 1) {
    colors.push(`#${rgbToHex([i, 255, 0]).join('')}`)
  }
  for (let i = 0; i <= 255; i += 1) {
    colors.push(`#${rgbToHex([0, 255, i]).join('')}`)
  }
  for (let i = 255; i >= 0; i -= 1) {
    colors.push(`#${rgbToHex([0, i, 255]).join('')}`)
  }
  for (let i = 0; i <= 255; i += 1) {
    colors.push(`#${rgbToHex([i, 0, 255]).join('')}`)
  }
  for (let i = 255; i > 0; i -= 1) {
    colors.push(`#${rgbToHex([255, 0, i]).join('')}`)
  }
  return colors
}
export const colors = generateColors()

export const hexToRGBA = (hex: ColorHex, opacity: number): string => {
  const { r, g, b } = convertHex(hex)
  return `rgba(${r},${g},${b},${opacity / 100})`
}

export function getSecondColors(prevColorIdx: number): number {
  const maxNumberColors = colors.length
  const excludeSimilarSize = 256
  const excludeSimilarEnd = 256
  const excludeSimilarStart = maxNumberColors - excludeSimilarEnd
  const excludeOppositeStart = 768 - excludeSimilarSize
  const excludeOppositeEnd = 768 + excludeSimilarSize

  let calculatedPositionCurrentColor = Math.round(
    (randomInteger(Math.log2(256)) / 256) * (maxNumberColors - (excludeOppositeEnd - excludeOppositeStart))
  )

  //! если мы попали в запрещенный диапазон, выносим за предели запрещенного диапазона
  if (excludeOppositeStart < calculatedPositionCurrentColor && calculatedPositionCurrentColor < excludeOppositeEnd) {
    calculatedPositionCurrentColor = excludeOppositeEnd + (calculatedPositionCurrentColor - excludeOppositeStart)
  }

  //! Исключаем похожие цвета, выносим за предели несочетающегося диапазона
  if (calculatedPositionCurrentColor < excludeSimilarEnd) {
    calculatedPositionCurrentColor += excludeSimilarEnd
  }

  //! Исключаем похожие цвета за пределами массива, выносим за предели несочетающегося диапазона
  if (calculatedPositionCurrentColor > excludeSimilarStart) {
    calculatedPositionCurrentColor -= excludeSimilarEnd
  }

  //! Пересчет положения текущего цвета после исключения попадания в запрещенный диапазон и исключения похожих цветов
  calculatedPositionCurrentColor = prevColorIdx + calculatedPositionCurrentColor

  //! если вышли за пределы массива, переноси в начало массива, на расстояние выхода за пределы
  if (calculatedPositionCurrentColor > maxNumberColors - 1) {
    calculatedPositionCurrentColor -= maxNumberColors - 1
  }
  return calculatedPositionCurrentColor
}

export function getDarkenedColor(colorHex: ColorHex, dimmingPercentage: DimmingPercentage): string {
  const colorRGB: ColorRGB = hexToRGB(colorHex)
  const darkedColor: ColorRGB = colorRGB.map(color => {
    if (color || color === 0) {
      return color - color * (dimmingPercentage / 100)
    }
    throw new Error(`The "color" parameter was not passed`)
  })
  return `#${rgbToHex(darkedColor).join('')}`
}

// ! It may be useful in the future
// const shuffle = array => {
//   for (let i = array.length - 1; i > 0; i -= 1) {
//     // console.log(randomInteger(Math.log2(256)))
//     let j = randomInteger(Math.log2(2)) * (i + 1)

//     j = j === 3 ? j - 2 : j
//     // eslint-disable-next-line no-param-reassign
//     ;[array[i], array[j]] = [array[j], array[i]]
//   }
// }

// export function generateColor() {
//   const colorsDefault = ['ff', '00']
//   const color = Math.floor(randomInteger(Math.log2(256))).toString(16)
//   colorsDefault.push(color)
//   shuffle(colorsDefault)

//   return '#000000'.slice(0, -colorsDefault.join('').length) + colorsDefault.join('')
// }
