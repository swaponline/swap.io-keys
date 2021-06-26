interface IMessagePrifix {
  message: string
  p2pkh: string
  wif: string
}

class BaseAdaptor {
  private name: string
  private priority: number
  private prefix: IMessagePrifix

  constructor(networkConfig) {
    const {
      name,
      priority,
      prefix,
    } = networkConfig

    this.name = name
    this.priority = priority
    this.prefix = prefix
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
}


export default BaseAdaptor