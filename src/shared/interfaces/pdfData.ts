import { IInvoiceData } from './invoiceData.interface';
import { IPdfTable } from './pdfTable.interface';

export interface IPdfData<T> {
  id: string;
  table: IPdfTable<T>;
  invoice: IInvoiceData;
}
