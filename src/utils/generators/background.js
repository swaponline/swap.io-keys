import { getMaxOfArray } from '@/utils/common'
import { getDarkenedColor, getSecondColors, colors } from './color'
import { randomInteger } from './randomizer'

// eslint-disable-next-line import/prefer-default-export
export class UserColorTheme {
  constructor() {
    this.DEFAULT_WIDTH_SVG = 200
    this.DEFAULT_HEIGHT_SVG = 120
    this.DEFAULT_HEIGHT_RECTANGLES = 500
    this.DEFAULT_OFFSET_RECT_X = -100
    this.DEFAULT_OFFSET_RECT_Y = -200
    this.widthRects = this.generateWidthRects()
    this.rectsModel = this.generateRectModel()
    this.ellipseModel = this.generateEllipseModel()
  }

  // eslint-disable-next-line class-methods-use-this
  generateWidthRects() {
    const quantityRects = randomInteger(Math.log2(3)) + 4
    const localWidthRects = []
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

  generateRectModel() {
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

  generateRectsView() {
    return this.rectsModel
      .map(model => {
        return `
      <rect 
        x="${model.xOffset}%"
        y="${model.yOffset}%"
        width="${model.width}%" height="${model.height}%"
        fill="${model.color}"
      />`
      })
      .join('')
  }

  generateEllipseModel() {
    const ellipseModels = []
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

  generateEllipseView() {
    return this.ellipseModel
      .map(model => {
        return `
        <ellipse
          style="mix-blend-mode: saturation; opacity: 0.4;"
          cx="${model.cx}%"
          cy="${model.cy}%"
          rx="${model.rx}%"
          ry="${model.ry}%"
          fill="${model.fill}"
        />
      `
      })
      .join(``)
  }

  generateBackground() {
    const angleInclination = randomInteger(Math.log2(64)) - 32
    return `
         <svg
            class="svg"
            width="${this.DEFAULT_WIDTH_SVG}"
            height="${this.DEFAULT_HEIGHT_SVG}"
            viewBox="0 0 200 120"
            preserveAspecRatio="xMaxYmax slice"
            xmlns="http://www.w3.org/2000/svg"
         >
            <defs>
               <filter id="f1" x="0" y="0">
               <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
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

  generateColorBasedDominantWidth() {
    const dominateWidth = getMaxOfArray(this.widthRects)
    let dominantColor = null

    this.rectsModel.forEach(model => {
      let localWidth = model.width

      localWidth = localWidth > 100 ? Number((localWidth - 100).toFixed(2)) : localWidth
      dominantColor = localWidth === dominateWidth ? model.color : dominantColor
    })

    //! Maybe you should put 46 instead of 43. You need to decide after checking by the customer
    return getDarkenedColor(dominantColor, 43)
  }

  getColorTheme() {
    return {
      background: this.generateBackground(),
      color: this.generateColorBasedDominantWidth()
    }
  }
}
