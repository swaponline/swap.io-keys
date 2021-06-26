interface ISendOptions {
  destination: string
  amount: number
}


class BaseWallet {
  private address: string = ``

  public getAddress(): string {
    return this.address
  }

  public send(options: ISendOptions): Promise<string>|false { return false }
}


export default BaseWallet