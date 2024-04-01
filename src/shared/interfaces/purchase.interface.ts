import { ICustomerPurchase } from './customerPurchase';
import { IInstallment } from './installment.interface';
import { IInvoicePurchase } from './invoicePurchase.interface';
import { IProductPurchase } from './productPurchase.interface';
import { IShippingPurchase } from './shippingPurchase.interface';

export interface IPurchase {
  customer: ICustomerPurchase;
  products: IProductPurchase[];
  shipping: IShippingPurchase;
  installments?: IInstallment[];
  invoice: IInvoicePurchase;
  active: boolean;
}
