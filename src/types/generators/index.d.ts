export type ColorHex = string
export type ColorRGB = number[]
export type DimmingPercentage = number

export type RectModel = {
  xOffset: number
  yOffset: number
  width: number
  height: number
  color: ColorHex
}

export type EllipseModel = {
  cx: number
  cy: number
  rx: number
  ry: number
  fill: ColorHex
}

export type WidthRects = number[]
export type RectView = string
export type EllipseView = string

export type ColorScheme = {
  background: string
  color: string
  colorForDarkTheme: string
  selectionColor: string
}
