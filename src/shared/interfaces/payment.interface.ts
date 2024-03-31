export interface IPayment {
  paymentMethod: string;
  paid: boolean;
  financed: boolean;
  share: number;
  currentShare: number;
  tax: number;
  subtotal: number;
  total: number;
  debt: number;
  paidAt: Date;
}
