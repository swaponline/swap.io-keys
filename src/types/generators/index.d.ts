export type ColorHex = string
export type ColorRGB = number[]
export type DimmingPercentage = number

export type Rect = {
  xOffset: number
  yOffset: number
  width: number
  height: number
  color: ColorHex
}

export type Ellipse = {
  cx: number
  cy: number
  rx: number
  ry: number
  fill: ColorHex
}

export type WidthRects = number[]

export type ColorScheme = {
  background: string
  color: string
  selectionColor: string
}
