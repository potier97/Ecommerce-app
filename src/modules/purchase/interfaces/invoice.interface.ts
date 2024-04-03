export interface IInvoice {
  paid: boolean;
  financed: boolean;
  share: number;
  currentShare: number;
  tax: number;
  subtotal: number;
  otherCosts: number;
  total: number;
  debt: number;
  interest: number;
  paidAt: Date;
}
