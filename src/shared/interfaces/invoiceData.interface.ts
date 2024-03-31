import { ICustomer } from './customer.interface';
import { IPayment } from './payment.interface';
import { IProduct } from './products.interface';
import { IShipping } from './shipping.interface';

export interface IInvoiceData {
  products: IProduct[];
  customer: ICustomer;
  payment: IPayment;
  shipping: IShipping;
}
