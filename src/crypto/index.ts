type PrivateKey = string
type PublicKey = string
type Address = string

type Profile = {
  privateKey: PrivateKey
  publicKey: PublicKey
  address: Address
}

export const coins = []

export const createProfile: () => Profile = () => {
  return { // mock
    privateKey: 'L2opBasCx47tgK9h4dP7r9kVRCjyBu7Z47fByBuamYwHYbzbP42g',
    publicKey: '029f7b0a848819c4e19c2282572a821b0a0dc265128f515af292fc84f81c4b1a3f',
    address: '1P8HdnAAFkJDbbKnfV3721KS9cVyX59x5j'
  }
}
