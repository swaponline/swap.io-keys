
interface ISendOptions {
  destination: string
  amount: number
}

class BaseWallet {
  private walletIndex: number
  private address: string = ``
  private privateKey: string = ``
  private publicKey: string = ``
  private networkAdaptor

  constructor(networkAdaptor, walletIndex: number) {
    this.walletIndex = walletIndex
    this.networkAdaptor = networkAdaptor


    // generate address
  }

  public getAddress(): string {
    return this.address
  }

  public getPrivateKey(): string {
    return this.privateKey
  }

  public getPublicKey(): string {
    return this.publicKey
  }

  public signMessage(message: string): string {
    return message
  }

  public signTransaction(transaction: any): any {
    return transaction
  }

  public send(options: ISendOptions): Promise<string>|false { return false }
}


export default BaseWallet