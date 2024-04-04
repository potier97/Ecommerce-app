export interface ICalculatePayment {
  overdue: boolean;
  debt: number;
  penaltyFee: number;
  capital: number;
  isTotalDebt: boolean;
}
