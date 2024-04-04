import { ICustomerPurchase } from './customer.interface';
import { IInstallments } from './installments.interface';
import { IInvoice } from './invoice.interface';

export interface IGeneratedPurchase {
  _id: string;
  customer: ICustomerPurchase;
  invoice: IInvoice;
  installments: IInstallments[];
  lastInstallment: IInstallments;
  isFirst: boolean;
  isNext: boolean;
  isOverdue: boolean;
}
