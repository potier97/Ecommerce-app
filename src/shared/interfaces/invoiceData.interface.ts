import { ICustomer } from './customer.interface';
import { IInvoice } from './invoice.interface';
import { IProduct } from './products.interface';
import { IShipping } from './shipping.interface';

export interface IInvoiceData {
  products: IProduct[];
  customer: ICustomer;
  invoice: IInvoice;
  shipping: IShipping;
}
