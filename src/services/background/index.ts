import { getMaxOfArray } from '@/utils/common'
import { RectModel, ColorScheme, RectView, EllipseView } from '@/types/generators'
import { getIntegerBasedOn, derivedRandom } from './utils/randomizer'
import { generateComponentsGradient } from './generateComponentsGradient'
import { getDarkenedColor, hexToRGBA } from './utils/color'

function generateBackground(rectsView: RectView, ellipseView: EllipseView): string {
  const angleInclination = getIntegerBasedOn(Math.log2(64)) - 32
  return `
       <svg
          class="svg"
          preserveAspectRatio="none"
          viewBox="0 0 200 120"
          xmlns="http://www.w3.org/2000/svg"
       >
          <defs>
             <filter id="f1" x="0" y="0">
             <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
             </filter>
             <filter id="f2" x="0" y="0"></filter>
          </defs>
          <g filter="url(#f1)" transform-origin="center center" transform="rotate(${angleInclination})">
             ${rectsView}
             ${ellipseView}
          </g>
       </svg>
    `
}

function generateDominantColorBasedOnWidth(rectsModel: RectModel[]): string {
  const localRectsModel = rectsModel.map(model => {
    let localWidth = model.width
    localWidth = localWidth > 100 ? Number((localWidth - 100).toFixed(2)) : localWidth
    return { ...model, width: localWidth }
  })

  const rectsWidth = localRectsModel.map(({ width }) => width)

  const dominateWidth = getMaxOfArray(rectsWidth)

  const { color } = rectsModel.find(({ width }) => {
    let localWidth = width
    localWidth = localWidth > 100 ? Number((localWidth - 100).toFixed(2)) : localWidth
    return localWidth === dominateWidth
  })

  return color
}

export function getUserColorScheme(publicKey: Buffer): ColorScheme {
  derivedRandom(publicKey)

  const { rectsModel, rectsView, ellipseView } = generateComponentsGradient()
  const background = generateBackground(rectsView, ellipseView)

  const dominantColor = generateDominantColorBasedOnWidth(rectsModel)
  const color = getDarkenedColor(dominantColor, 43)
  const colorForDarkTheme = dominantColor
  const selectionColor = hexToRGBA(dominantColor, 24)

  return {
    background,
    color,
    colorForDarkTheme,
    selectionColor
  }
}
