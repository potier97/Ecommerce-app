export interface IInvoice {
  paymentMethod: string;
  paid: boolean;
  financed: boolean;
  share: number;
  currentShare: number;
  tax: number;
  subtotal: number;
  otherCosts: number;
  total: number;
  debt: number;
  paidAt: Date;
}
