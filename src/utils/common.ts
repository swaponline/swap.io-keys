import cloneDeepLodash from 'lodash.clonedeep'

export function getMaxOfArray(numArray: number[]): number {
  return Math.max.apply(null, numArray)
}

export function randomInteger(min: number, max: number): number {
  const rand = min + Math.random() * (max + 1 - min)
  return Math.floor(rand)
}

export function getRandomIntegers(count: number, maxValue: number): number[] {
  const randomIntegers: number[] = []

  for (let i = 0; randomIntegers.length < count; i += 1) {
    let replacementIndex: number = randomInteger(0, maxValue)
    while (randomIntegers.includes(replacementIndex)) {
      replacementIndex = randomInteger(0, maxValue)
    }
    randomIntegers.push(replacementIndex)
  }
  return randomIntegers
}

export function setCSSCustomProperty(propertyName: string, value: string): void {
  document.documentElement.style.setProperty(`--${propertyName}`, value)
}

export function cloneDeep(objects) {
  return cloneDeepLodash(objects)
}
