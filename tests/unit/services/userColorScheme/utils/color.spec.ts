import * as randomaizer from '@/services/userColorScheme/utils/randomizer'
import { hexToRGBA, getDarkenedColor, getSecondColors } from '@/services/userColorScheme/utils/color'

let deterministicStr

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
randomaizer.derivedRandom = jest.fn().mockImplementation(() => {
  deterministicStr = 'sdfsdfsd'
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
randomaizer.getIntegerBasedOn = jest.fn().mockImplementation(() => {
  return Math.floor(Math.random())
})

describe('util color', () => {
  it.each`
    hex          | opacity | rgba
    ${'#0071f1'} | ${24}   | ${'rgba(0,113,241,0.24)'}
    ${'#760293'} | ${40}   | ${'rgba(118,2,147,0.4)'}
  `(
    `when hexToRGBA is called with the hex "$hex" and opacity "$opacity" parameters, 
    it returns the correct value rgba "$rgba"`,
    ({ hex, opacity, rgba }) => {
      const resultRgba = hexToRGBA(hex, opacity)

      expect(resultRgba).toBe(rgba)
    }
  )

  it.each`
    colorHex     | dimmingPercentage | darkenedColor
    ${'#0071f1'} | ${43}             | ${'#004089'}
    ${'#760293'} | ${70}             | ${'#23002c'}
  `(
    `when getDarkenedColor is called with the colorHex
    "$colorHex" and dimmingPercentage "$dimmingPercentage" parameters,
    it returns the correct value rgba "$darkenedColor"`,
    ({ colorHex, dimmingPercentage, darkenedColor }) => {
      const resultDarkenedColor = getDarkenedColor(colorHex, dimmingPercentage)

      expect(resultDarkenedColor).toBe(darkenedColor)
    }
  )

  it.each`
    prevColorIdx | colorIdx
    ${30}        | ${286}
    ${256}       | ${512}
  `(
    `when generateEllipseModel is called with the prevColorIdx "$prevColorIdx" parameters, 
    it returns the correct value colorIdx "$colorIdx"`,
    ({ prevColorIdx, colorIdx }) => {
      const resultColorIdx = getSecondColors(prevColorIdx)

      expect(resultColorIdx).toBe(colorIdx)
    }
  )
})
