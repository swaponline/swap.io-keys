
interface ISendOptions {
  destination: string
  amount: number
}

class BaseWallet {
  private walletIndex: number
  private address: string = ``
  private networkAdaptor

  constructor(networkAdaptor, walletIndex: number) {
    this.walletIndex = walletIndex
    this.networkAdaptor = networkAdaptor


    // generate address
  }

  public getAddress(): string {
    return this.address
  }

  public send(options: ISendOptions): Promise<string>|false { return false }
}


export default BaseWallet