import { getMaxOfArray } from '@/utils/common'
import { getDarkenedColor, getSecondColors, colors, ColorHex, hexToRGBA } from './color'
import { randomInteger } from './randomizer'

type Rect = {
  xOffset: number
  yOffset: number
  width: number
  height: number
  color: ColorHex
}

type Ellipse = {
  cx: number
  cy: number
  rx: number
  ry: number
  fill: ColorHex
}

type WidthRects = number[]

export type ColorTheme = {
  background: string
  color: string
  colorSelection: string
}

export class UserColorTheme {
  DEFAULT_WIDTH_SVG: number

  DEFAULT_HEIGHT_SVG: number

  DEFAULT_HEIGHT_RECTANGLES: number

  DEFAULT_OFFSET_RECT_X: number

  DEFAULT_OFFSET_RECT_Y: number

  widthRects: number[]

  dominantColor: string

  rectsModel: Rect[]

  ellipseModel: Ellipse[]

  constructor() {
    this.DEFAULT_WIDTH_SVG = 200
    this.DEFAULT_HEIGHT_SVG = 120
    this.DEFAULT_HEIGHT_RECTANGLES = 500
    this.DEFAULT_OFFSET_RECT_X = -100
    this.DEFAULT_OFFSET_RECT_Y = -200
    this.dominantColor = ''
    this.widthRects = this.generateWidthRects()
    this.rectsModel = this.generateRectModel()
    this.ellipseModel = this.generateEllipseModel()
  }

  // eslint-disable-next-line class-methods-use-this
  generateWidthRects(): WidthRects {
    const quantityRects = randomInteger(Math.log2(3)) + 4
    const localWidthRects: WidthRects = []
    for (let i = 0; i < quantityRects; i += 1) {
      localWidthRects.push(20 + randomInteger(Math.log2(20)))
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

  generateRectModel(): Rect[] {
    let prevColorIdx = 0
    let localXOffset = 0

    return this.widthRects.map((width, index) => {
      const colorIdx = getSecondColors(prevColorIdx)
      prevColorIdx = colorIdx

      if (index !== 0) {
        localXOffset += this.widthRects[index - 1]
      }

      if (index === 0) {
        return {
          xOffset: this.DEFAULT_OFFSET_RECT_X,
          yOffset: this.DEFAULT_OFFSET_RECT_Y,
          width: width + 100,
          height: this.DEFAULT_HEIGHT_RECTANGLES,
          color: colors[colorIdx]
        }
      }

      if (index === this.widthRects.length - 1) {
        return {
          xOffset: localXOffset,
          yOffset: this.DEFAULT_OFFSET_RECT_Y,
          width: width + 100,
          height: this.DEFAULT_HEIGHT_RECTANGLES,
          color: colors[colorIdx]
        }
      }

      return {
        xOffset: localXOffset,
        yOffset: this.DEFAULT_OFFSET_RECT_Y,
        width,
        height: this.DEFAULT_HEIGHT_RECTANGLES,
        color: colors[colorIdx]
      }
    })
  }

  generateRectsView(): string {
    return this.rectsModel
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

  generateEllipseModel(): Ellipse[] {
    const ellipseModels: Ellipse[] = []

    const quantityEllipse = 2
    let prevColorIdx = 0

    const initialEllipseModel = this.rectsModel.filter((_, index) => {
      const positionIdx = this.rectsModel.length === 4 ? 3 : 4
      return index === 1 || index === positionIdx
    })

    for (let i = 0; i < quantityEllipse; i += 1) {
      const rectColorIdx = colors.indexOf(initialEllipseModel[i].color)
      prevColorIdx = rectColorIdx
      const colorIdx = getSecondColors(prevColorIdx)

      const { xOffset: cx } = initialEllipseModel[i]
      const cy = randomInteger(Math.log2(40)) + 40
      const rx = randomInteger(Math.log2(20)) + 15
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

  generateEllipseView(): string {
    return this.ellipseModel
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

  generateBackground(): string {
    const angleInclination = randomInteger(Math.log2(128)) - 64
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
               ${this.generateRectsView()}
               ${this.generateEllipseView()}
            </g>
         </svg>
      `
  }

  generateColorBasedDominantWidth(): string {
    const dominateWidth = getMaxOfArray(this.widthRects)
    this.rectsModel.forEach(model => {
      let localWidth = model.width

      localWidth = localWidth > 100 ? Number((localWidth - 100).toFixed(2)) : localWidth
      this.dominantColor = localWidth === dominateWidth ? model.color : this.dominantColor
    })

    //! Maybe you should put 46 instead of 43. You need to decide after checking by the customer
    return getDarkenedColor(this.dominantColor, 43)
  }

  getColorTheme(): ColorTheme {
    return {
      background: this.generateBackground(),
      color: this.generateColorBasedDominantWidth(),
      colorSelection: hexToRGBA(this.dominantColor, 24)
    }
  }
}
