let deterministicStr: string

export function derivedRandom(source: Buffer): void {
  deterministicStr = source
    .reduce((str, newSource) => {
      return str + newSource.toString(2).padStart(8, '0')
    }, '')
    .substring(8)
}

//  ! Now this object will give you pseudo-random Int values
// ! from 0 to 2^N - 1. For example if you want a value from
// ! 0 to 31 you will call rnd.pop(5). Because 2^5 = 32.

// ! Conveniently you can use this function:
//! randomInteger(Math.log2(128)));
export const getIntegerBasedOn = (bits: number): number => {
  const ret = parseInt(deterministicStr.substring(0, bits), 2)
  deterministicStr = deterministicStr.substring(bits) + deterministicStr.substring(0, bits)
  return ret
}
