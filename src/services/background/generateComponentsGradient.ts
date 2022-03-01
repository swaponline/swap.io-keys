import { RectModel, EllipseModel, WidthRects, RectView, EllipseView } from '@/types/generators'
import { getSecondColors, colors } from '@/services/background/utils/color'
import { getIntegerBasedOn } from './utils/randomizer'

const DEFAULT_HEIGHT_RECTANGLES = 500
const DEFAULT_OFFSET_RECT_X = -100
const DEFAULT_OFFSET_RECT_Y = -200

type CreateComponentsGradient = {
  rectsView: RectView
  ellipseView: EllipseView
  rectsModel: RectModel[]
}

export function generateComponentsGradient(): CreateComponentsGradient {
  function generateWidthRects(): WidthRects {
    const quantityRects = getIntegerBasedOn(Math.log2(3)) + 4
    const localWidthRects: WidthRects = []
    for (let i = 0; i < quantityRects; i += 1) {
      localWidthRects.push(20 + getIntegerBasedOn(Math.log2(20)))
    }
    const sumAllWidthRects = localWidthRects.reduce((a, b) => a + b, 0)

    if (sumAllWidthRects < 100 || sumAllWidthRects > 100) {
      return localWidthRects.map(width => {
        const newWidth = (100 / sumAllWidthRects) * width
        return Number(newWidth.toFixed(2))
      })
    }
    return localWidthRects
  }

  function generateRectModel(widthRects: WidthRects): RectModel[] {
    let prevColorIdx = 0
    let localXOffset = 0

    return widthRects.map((width, index) => {
      const colorIdx = getSecondColors(prevColorIdx)
      prevColorIdx = colorIdx

      if (index !== 0) {
        localXOffset += widthRects[index - 1]
      }

      if (index === 0) {
        return {
          xOffset: DEFAULT_OFFSET_RECT_X,
          yOffset: DEFAULT_OFFSET_RECT_Y,
          width: width + 100,
          height: DEFAULT_HEIGHT_RECTANGLES,
          color: colors[colorIdx]
        }
      }

      if (index === widthRects.length - 1) {
        return {
          xOffset: localXOffset,
          yOffset: DEFAULT_OFFSET_RECT_Y,
          width: width + 100,
          height: DEFAULT_HEIGHT_RECTANGLES,
          color: colors[colorIdx]
        }
      }

      return {
        xOffset: localXOffset,
        yOffset: DEFAULT_OFFSET_RECT_Y,
        width,
        height: DEFAULT_HEIGHT_RECTANGLES,
        color: colors[colorIdx]
      }
    })
  }

  function generateRectsView(rectsModel: RectModel[]): string {
    return rectsModel
      .map(model => {
        return `
        <rect
          x="${model.xOffset}%"
          y="${model.yOffset}%"
          width="${model.width}%"
          height="${model.height}%"
          fill="${model.color}"
        />`
      })
      .join('')
  }

  function generateEllipseModel(rectsModel): EllipseModel[] {
    const ellipseModels: EllipseModel[] = []

    const quantityEllipse = 2
    let prevColorIdx = 0

    const initialEllipseModel = rectsModel.filter((_, index) => {
      const positionIdx = rectsModel.length === 4 ? 3 : 4
      return index === 1 || index === positionIdx
    })

    for (let i = 0; i < quantityEllipse; i += 1) {
      const rectColorIdx = colors.indexOf(initialEllipseModel[i].color)
      prevColorIdx = rectColorIdx
      const colorIdx = getSecondColors(prevColorIdx)

      const { xOffset: cx } = initialEllipseModel[i]
      const cy = getIntegerBasedOn(Math.log2(40)) + 40
      const rx = getIntegerBasedOn(Math.log2(20)) + 10
      const ry = rx * 3
      const fill = colors[colorIdx]

      ellipseModels.push({
        cx,
        cy,
        rx,
        ry,
        fill
      })
    }

    return ellipseModels
  }

  function generateEllipseView(ellipseModel: EllipseModel[]): string {
    return ellipseModel
      .map(model => {
        return `
        <ellipse
          style="mix-blend-mode: multiply;
          opacity: 0.9;"
          cx="${model.cx}%"
          cy="${model.cy}%"
          rx="${model.rx}%"
          ry="${model.ry}%"
          fill="${model.fill}"
        />`
      })
      .join(``)
  }

  const widthRects = generateWidthRects()
  const rectsModel = generateRectModel(widthRects)
  const rectsView = generateRectsView(rectsModel)

  const ellipseModel = generateEllipseModel(rectsModel)
  const ellipseView = generateEllipseView(ellipseModel)

  return {
    rectsView,
    ellipseView,
    rectsModel
  }
}
