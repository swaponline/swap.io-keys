export function getMaxOfArray(numArray: number[]): number {
  return Math.max.apply(null, numArray)
}

export function randomInteger(min: number, max: number): number {
  const rand = min + Math.random() * (max + 1 - min)
  return Math.floor(rand)
}

export function setCSSCustomProperty(propertyName: string, value: string): void {
  document.documentElement.style.setProperty(propertyName, value)
}
