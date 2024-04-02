import { IInvoiceData } from 'shared/interfaces/invoiceData.interface';
import { generatePdf } from './makePdf';
import { IPdfData } from 'shared/interfaces/pdfData';
import {
  RESUME_INVOICE_ITEMS_SHIPPING,
  RESUME_INVOICE_ITEMS_SUBTOTAL,
  RESUME_INVOICE_ITEMS_TAX,
  RESUME_INVOICE_ITEMS_TOTAL,
} from 'shared/constants/invoicePdf';
import { IPdfTable } from 'shared/interfaces/pdfTable.interface';
import { IPdfResumeTable } from 'shared/interfaces/pdfResumeTable';

interface IProductTable {
  name: string;
  price: string;
  quantity: string;
  tax: string;
  total: string;
}

export const invoicePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer> => {
  const products: IProductTable[] = [];
  invoiceData.products.forEach(product => {
    products.push({
      name: product.name,
      price: `$ ${(product.price - product.tax).toString()}`,
      quantity: product.quantity.toString(),
      tax: `$ ${product.tax.toString()}`,
      total: `$ ${(product.price * product.quantity).toString()}`,
    });
  });
  const resume: IPdfResumeTable[] = [
    {
      name: RESUME_INVOICE_ITEMS_SUBTOTAL,
      value: invoiceData.invoice.subtotal,
    },
    {
      name: RESUME_INVOICE_ITEMS_TAX,
      value: invoiceData.invoice.tax,
    },
    {
      name: RESUME_INVOICE_ITEMS_SHIPPING,
      value: invoiceData.invoice.tax,
    },
    {
      name: RESUME_INVOICE_ITEMS_TOTAL,
      value: invoiceData.invoice.total,
    },
  ];
  resume.forEach(item => {
    products.push({
      name: '',
      price: '',
      quantity: '',
      tax: item.name,
      total: `$ ${item.value.toString()}`,
    });
  });

  const pdfData: IPdfTable<IProductTable> = {
    xInit: 20,
    yOffset: 20,
    tablePosition: 290,
    title: 'Purchased Items',
    titleFontSize: 16,
    subtitle: 'Description',
    subtitleFontSize: 12,
    header: ['Product', 'Price', 'Amount', 'Tax', 'Total'],
    headerFontSize: 14,
    headerFontFamily: 'Helvetica-Bold',
    contentFontSize: 12,
    contentFontFamily: 'Helvetica',
    spacing: [0.35, 0.2, 0.15, 0.15, 0.15],
    initWidth: [0, 0.35, 0.55, 0.7, 0.85],
    nameRow: ['name', 'price', 'quantity', 'tax', 'total'],
    aling: ['left', 'right', 'right', 'right', 'right'],
    resumeRows: resume.length,
    content: products,
  };

  const data: IPdfData<IProductTable> = {
    id: invoiceData['_id'].toString(),
    table: pdfData,
    invoice: invoiceData,
  };

  const result = await generatePdf(data);
  return result;
};
