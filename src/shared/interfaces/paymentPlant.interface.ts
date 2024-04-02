export interface IPaymentPlan {
  date: string;
  installment: number;
  monthlyPayment: number;
  interest: number;
  principal: number;
  debt: number;
}
