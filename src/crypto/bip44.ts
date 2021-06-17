type Path = string

const createDerivePath = ({ coinIndex, addressIndex }: { coinIndex: number; addressIndex: number }): Path => {
  /*
  In fact, not every testnet of coins has an index of 1
  Therefore, specify the testnet coin index in the settings
  */

  const path = `m/44'/${coinIndex}'/0'/0/${addressIndex}`
  return path
}

export default {
  createDerivePath
}
