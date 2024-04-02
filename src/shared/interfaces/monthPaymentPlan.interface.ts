import { IPaymentPlan } from './paymentPlant.interface';

export interface IMonthPaymentPlan {
  plan: IPaymentPlan[];
  totalDebt: number;
  totalInterest: number;
  totalPaymentPlan: number;
}
