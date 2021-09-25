/* eslint-disable */

import BaseWallet from '../wallets/BaseWallet'
import { ISignedMessage } from '../types'

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



type Seed = Buffer

class BaseAdaptor {
  private name: string
  private priority: number
  private prefix: IMessagePrifix
  private symbol: string
  private coin: ICoin
  private bip44: IBip44
  private wallets: Array<BaseWallet> = []

  private parentAdaptor: BaseAdaptor | boolean = false

  constructor(networkConfig) {
    const {
      name,
      priority,
      prefix,
      slug: symbol,
      coin,
      bip44,
    } = networkConfig

    this.name = name
    this.symbol = symbol
    this.priority = priority
    this.prefix = prefix
    this.coin = coin
    this.bip44 = bip44
  }

  public setParentAdaptor(parentAdaptor: BaseAdaptor): void {
    this.parentAdaptor = parentAdaptor
  }

  public getCoin(): ICoin {
    return this.coin
  }

  public getName(): string {
    return this.name
  }

  public getSymbol(): string {
    return this.symbol
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

  public createWallet(options = {}): BaseWallet|false { return false }

  public getWallet(index: number): BaseWallet|false { return false }

  public signMessage(options = {}): ISignedMessage|false { return false }
}


export default BaseAdaptor