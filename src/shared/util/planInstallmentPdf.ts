import { generatePdf } from './makePdf';
import { IPdfData } from 'shared/interfaces/pdfData';
import { IPdfTable } from 'shared/interfaces/pdfTable.interface';
import { IDescriptionPdf } from 'shared/interfaces/descriptionPdf.interface';
import { format } from 'date-fns';
import { IInstallmentPlan } from 'shared/interfaces/installmentPlan.interface';
import { IPdfResumeTable } from 'shared/interfaces/pdfResumeTable';
import {
  PLAN_TOTAL_DEBT,
  PLAN_TOTAL_INTEREST,
  PLAN_TOTAL_PAYMENT,
} from 'shared/constants/invoicePdf';

interface IInstallmentTable {
  date: string;
  installment: string;
  monthlyPayment: string;
  interest: string;
  principal: string;
  debt: string;
}

export const installmentPlanPdf = async (
  invoiceData: IInstallmentPlan
): Promise<Buffer> => {
  const plan: IInstallmentTable[] = [];
  invoiceData.resume.plan.forEach(planRow => {
    plan.push({
      date: planRow.date,
      installment: `${planRow.installment.toString()}`,
      monthlyPayment: `$ ${planRow.monthlyPayment.toString()}`,
      interest: `$ ${planRow.interest.toString()}`,
      principal: `$ ${planRow.principal.toString()}`,
      debt: `$ ${planRow.debt.toString()}`,
    });
  });
  const resume: IPdfResumeTable[] = [
    {
      name: PLAN_TOTAL_DEBT,
      value: invoiceData.resume.totalDebt,
    },
    {
      name: PLAN_TOTAL_INTEREST,
      value: invoiceData.resume.totalInterest,
    },
    {
      name: PLAN_TOTAL_PAYMENT,
      value: invoiceData.resume.totalPaymentPlan,
    },
  ];
  resume.forEach(item => {
    plan.push({
      date: '',
      installment: '',
      monthlyPayment: '',
      interest: '',
      principal: item.name,
      debt: `$ ${item.value.toString()}`,
    });
  });

  const pdfData: IPdfTable<IInstallmentTable> = {
    yOffset: 9,
    tablePosition: 200,
    title: 'Installment Plan',
    titleFontSize: 12,
    subtitle: '',
    subtitleFontSize: 0,
    header: ['Date', 'Fee', 'Pay', 'Interest', 'principal', 'Debt'],
    headerFontSize: 10,
    headerFontFamily: 'Helvetica-Bold',
    contentFontSize: 10,
    contentFontFamily: 'Helvetica',
    spacing: [0.1, 0.1, 0.2, 0.2, 0.2, 0.2],
    initWidth: [0, 0.1, 0.2, 0.4, 0.6, 0.8],
    nameRow: [
      'date',
      'installment',
      'monthlyPayment',
      'interest',
      'principal',
      'debt',
    ],
    aling: ['left', 'center', 'right', 'right', 'right', 'right'],
    resumeRows: resume.length,
    content: plan,
  };

  const xInit = 50;
  const description: IDescriptionPdf = {
    title: 'Customer Info',
    titleFontSize: 12,
    titleFont: 'Helvetica-Bold',
    descriptionPosition: 110,
    yOffset: 14,
    contentFontSize: 10,
    columns: 3,
    content: [
      {
        label: 'Name',
        value: invoiceData.customer.userName,
        xValue: 30,
      },
      {
        label: 'Mail',
        value: invoiceData.customer.email,
        xValue: 25,
      },
      {
        label: 'Date',
        value: `${format(invoiceData.invoice.paidAt, 'PPpp')}`,
        xValue: 30,
      },
      {
        label: 'Address',
        value: invoiceData.customer.address,
        xValue: 45,
      },
      {
        label: 'Shipment',
        value: invoiceData.customer.shippingMethod,
        xValue: 50,
      },
      {
        label: 'Total Fees',
        value: invoiceData.invoice.share.toString(),
        xValue: 55,
      },
      {
        label: 'Current Fee',
        value: invoiceData.customer.currentInstallment.toString(),
        xValue: 60,
      },
    ],
  };
  const data: IPdfData<IInstallmentTable> = {
    id: invoiceData.id,
    xInit: xInit,
    table: pdfData,
    description: description,
  };

  const result = await generatePdf(data);
  return result;
};
