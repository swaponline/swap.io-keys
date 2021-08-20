/* eslint-disable */

interface ISendOptions {
  destination: string
  amount: number
}

class BaseWallet {
  private walletIndex: number
  protected address: string = ``
  protected privateKey: string = ``
  protected publicKey: string = ``
  protected template: string = ``
  private networkAdaptor
  private seed

  constructor(networkAdaptor, seed, walletIndex: number) {
    this.walletIndex = walletIndex
    this.networkAdaptor = networkAdaptor
    this.seed = seed


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