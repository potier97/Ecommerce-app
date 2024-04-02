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
import { IDescriptionPdf } from 'shared/interfaces/descriptionPdf.interface';
import { format } from 'date-fns';

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

  const xInit = 50;

  const description: IDescriptionPdf = {
    title: 'Customer Info',
    titleFontSize: 16,
    titleFont: 'Helvetica-Bold',
    descriptionPosition: 130,
    yOffset: 25,
    contentFontSize: 12,
    columns: 2,
    content: [
      {
        label: 'Name',
        value: invoiceData.customer.userName,
        xValue: 35,
      },
      {
        label: 'Address',
        value: invoiceData.shipping.address,
        xValue: 52,
      },
      {
        label: 'Mail',
        value: invoiceData.customer.email,
        xValue: 30,
      },
      {
        label: 'Shipment',
        value: invoiceData.shipping.shippingMethod,
        xValue: 60,
      },
      {
        label: 'Date',
        value: `${format(invoiceData.invoice.paidAt, 'PPpp')}`,
        xValue: 30,
      },
      {
        label: 'Destination',
        value: `${invoiceData.shipping.city} - ${invoiceData.shipping.country}`,
        xValue: 70,
      },
      {
        label: 'Fees',
        value: invoiceData.invoice.share.toString(),
        xValue: 30,
      },
    ],
  };

  const data: IPdfData<IProductTable> = {
    id: invoiceData['_id'].toString(),
    xInit: xInit,
    table: pdfData,
    description: description,
  };

  const result = await generatePdf(data);
  return result;
};
