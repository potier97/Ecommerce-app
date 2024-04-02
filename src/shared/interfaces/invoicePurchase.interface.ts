export interface IInvoicePurchase {
  paymentMethod: string;
  paid: boolean;
  financed: boolean;
  share: number;
  currentShare: number;
  subtotal: number;
  tax: number;
  otherCosts: number;
  total: number;
  debt: number;
  interest: number;
  paidAt: Date;
}
