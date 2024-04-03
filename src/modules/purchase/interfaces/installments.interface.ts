export interface IInstallments {
  _id: string;
  paymentMethod: string;
  installment: number;
  amount: number;
  amountPaid: number;
  interest: number;
  principal: number;
  debt: number;
  payment: boolean;
  overdue: boolean;
  dueAt: Date;
  deadlineAt: Date;
  paymentAt: Date;
}
