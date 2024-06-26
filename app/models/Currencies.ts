class Currency {
  id: number;
  bank?: string;
  currency?: string;
  currencyDate?: Date;
  currencyRate?: number;
  createdBy?: string;
  createdDate?: Date;
  updatedBy?: string;
  updatedDate?: Date;

  constructor(
    Id: number = 0,
    Bank: string = "",
    Currency: string = "",
    CurrencyDate: Date = new Date(),
    CurrencyRate: number = 0,
    CreatedBy: string = "",
    CreatedDate: Date = new Date(),
    UpdatedBy: string = "",
    UpdatedDate: Date = new Date()
  ) {
    this.id = Id;
    this.bank = Bank;
    this.currency = Currency;
    this.currencyDate = CurrencyDate;
    this.currencyRate = CurrencyRate;
    this.createdBy = CreatedBy;
    this.createdDate = CreatedDate;
    this.updatedBy = UpdatedBy;
    this.updatedDate = UpdatedDate;
  }
}

export default Currency;
