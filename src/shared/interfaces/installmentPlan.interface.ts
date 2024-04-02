import { IInvoice } from './invoice.interface';
import { IMonthPaymentPlan } from './monthPaymentPlan.interface';

export interface ICustomerInstallmentPlan {
  userName: string;
  email: string;
  address: string;
  shippingMethod: string;
  paidAt: Date;
  currentInstallment: number;
  totalInstallments: number;
}

export interface IInstallmentPlan {
  id: string;
  invoice: IInvoice;
  resume: IMonthPaymentPlan;
  customer: ICustomerInstallmentPlan;
}
