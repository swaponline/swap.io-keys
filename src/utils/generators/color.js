import { randomInteger } from './randomizer'

function hexToRgb(hex) {
  if (/^#([a-f0-9]{3}){1,2}$/.test(hex)) {
    const newHex = hex.length === 4 ? `#${[hex[1], hex[1], hex[2], hex[2], hex[3], hex[3]].join('')}` : hex

    const c = `0x${newHex.substring(1)}`

    return [(c >> 16) & 255, (c >> 8) & 255, c & 255]
  }

  return null
}

function rgbToHex(rgb) {
  return rgb.map(int => {
    const strBase16 = parseInt(int, 10).toString(16) // Convert to a base16 string
    return strBase16.length === 1 ? `0${strBase16}` : strBase16 // Add zero if we get only one character
  })
}

// ! Creates an array of 1535 colors
function generateColors() {
  const colors = []
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

export function getSecondColors(p) {
  const maxNumberColors = 1535
  const ex = 256
  const ex01 = 256
  const ex02 = maxNumberColors - ex01
  const ex1 = 768 - ex
  const ex2 = 768 + ex

  let p2 = Math.round((randomInteger(Math.log2(256)) / 256) * (maxNumberColors - (ex2 - ex1)))
  //! если мы попали в запрещенный диапазон
  if (ex1 < p2 && p2 < ex2) {
    //! выносим за предели запрещенного диапазона
    p2 = ex2 + (p2 - ex1)
  }

  //! Если мы попали в несочетающийся цвет
  if (p2 < ex01) {
    //! выносим за предели несочетающегося диапазона
    p2 += ex01
  }

  //! Если мы попали в несочетающийся цвет
  if (p2 > ex02) {
    //! выносим за предели несочетающегося диапазона
    p2 -= ex01
  }

  p2 = p + p2
  //! если вышли за пределы массива
  if (p2 > maxNumberColors - 1) {
    //! переноси в начало массива, на расстояние выхода за пределы
    p2 -= maxNumberColors - 1
  }
  return p2
}

/**
 *
 * @param {string} colorHex затемняемый цве тв формате HEX
 * @param {number} dimmingPercentage процент на который затемняется цвет
 */
export function getDarkenedColor(colorHex = '', dimmingPercentage = 0) {
  const colorRGB = hexToRgb(colorHex)
  const darkedColor = colorRGB.map(color => color - color * (dimmingPercentage / 100))
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
