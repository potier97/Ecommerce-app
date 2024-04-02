import { IDescriptionPdf } from './descriptionPdf.interface';
import { IPdfTable } from './pdfTable.interface';

export interface IPdfData<T> {
  id: string;
  xInit: number;
  table: IPdfTable<T>;
  description: IDescriptionPdf;
}
