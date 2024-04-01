export interface IInstallment {
  paymentMethod: string;
  installment: number;
  amount: number;
  payment: boolean;
  overdue: boolean;
  dueAt: Date;
  paymentAt: Date;
}
