import BaseWallet from '../wallets/BaseWallet'


interface IMessagePrifix {
  message: string
  p2pkh: string
  wif: string
}

interface IBip44 {
  purpose: string
  cointype: string
}

interface ICoin {
  symbol: string
  slug: string
  name: string
  name_plural: string
  denominator: number
}

class BaseAdaptor {
  private name: string
  private priority: number
  private prefix: IMessagePrifix
  private coin: ICoin
  private bip44: IBip44
  private wallets: Array<BaseWallet> = []

  private parentAdaptor: BaseAdaptor | boolean = false

  constructor(networkConfig) {
    const {
      name,
      priority,
      prefix,
      coin,
      bip44,
    } = networkConfig

    this.name = name
    this.priority = priority
    this.prefix = prefix
    this.coin = coin
    this.bip44 = bip44
  }

  public getCoin(): ICoin {
    return this.coin
  }

  public getName(): string {
    return this.name
  }

  public getPriority(): number {
    return this.priority
  }

  public getPrefix(): IMessagePrifix {
    return this.prefix
  }

  public getWallets(): Array<BaseWallet> {
    return this.wallets
  }
  public createWallet(index: number): BaseWallet|false { return false }
  public getWallet(index: number): BaseWallet|false { return false }
}


export default BaseAdaptor