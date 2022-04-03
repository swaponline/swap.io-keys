export const DEFAULT_TABLE_MATRIX = Array.from({ length: 24 }, () => {
  return {
    value: '',
    input: true
  }
})
export const FULL_TABLE_MATRIX = Array.from({ length: 24 }, () => {
  return {
    value: 'hello word',
    input: false
  }
})
export const CHANGE_TABLE_MATRIX = DEFAULT_TABLE_MATRIX.map((tableMAtrix, index) => {
  const changeTableMatrix =
    index === 1 || index === 2 || index === 4 ? { value: 'hello word', input: false } : { ...tableMAtrix }

  return changeTableMatrix
})

export const USER_COLOR_SCHEME = {
  background: 'test',
  color: 'test',
  colorForDarkTheme: 'test',
  selectionColor: 'test'
}
