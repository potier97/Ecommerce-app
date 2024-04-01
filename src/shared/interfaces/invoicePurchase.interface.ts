export interface IInvoicePurchase {
  paymentMethod: string;
  paid: boolean;
  financed: boolean;
  shares: number;
  currentShare: number;
  subtotal: number;
  tax: number;
  otherCosts: number;
  total: number;
  debt: number;
  paidAt: Date;
}
