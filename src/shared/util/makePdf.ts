import { Buffer } from 'buffer';
import { format } from 'date-fns';
import * as path from 'path';
import PDFDocument from 'pdfkit';
//INTERFACES
import { IInvoiceData } from 'shared/interfaces/invoiceData.interface';
import {
  BRAND_NAME,
  BRAND_PLACE,
  DOCUMENT_MARGIN,
  DOCUMENT_SIZE,
  FOOTER_TEXT,
  IMAGE_LOGO_PATH,
  URL_BRAND,
} from 'shared/constants/invoicePdf';
import { IPdfData } from 'shared/interfaces/pdfData';
import { IPdfTable } from 'shared/interfaces/pdfTable.interface';

//INSPIRATED BY https://pspdfkit.com/blog/2019/generate-pdf-invoices-pdfkit-nodejs/
export const generatePdf = async (pdfData: IPdfData<any>): Promise<Buffer> => {
  //GENERATE A DOC OBJECT
  let doc = new PDFDocument({
    size: DOCUMENT_SIZE,
    margin: DOCUMENT_MARGIN,
    bufferPages: true,
  });
  //LOGO PATH
  const imagePath = path.join(__dirname, IMAGE_LOGO_PATH);
  //GENERATE HEADER AND FOOTER
  doc = generateHeaderInvoice(doc, imagePath, pdfData.id);
  doc = generateFooterInvoce(doc, imagePath);
  //GENERATE CUSTOMER INFORMATION
  doc = generateCustomerInformation(doc, pdfData.invoice);
  //UTIL WIDTH SPACE
  const width = doc['page'].width - 100;
  // GENERATE TABLE
  doc = generateTableInvoice(doc, width, pdfData.table);
  //RETURN BUFFER
  return new Promise<Buffer>((resolve, reject) => {
    const buffers: Uint8Array[] = [];
    doc.on('data', (chunk: Uint8Array) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
    doc.end();
  });
};

// ======================================================================
// ======================================================================
// ========================= HEADER FUNCTIONS ===========================
// ======================================================================
// ======================================================================

const generateHeaderInvoice = (
  data: any,
  imagePath: string,
  invoice: string
) => {
  return data
    .image(imagePath, 50, 45, { width: 50 })
    .fillColor('#33658a')
    .fontSize(16)
    .text(`N° ${invoice.toString()}`, 110, 65) // (content, x, y)
    .fontSize(10)
    .fillColor('#33658a')
    .text(BRAND_NAME, 200, 65, {
      align: 'right',
      link: URL_BRAND,
      underline: true,
    })
    .fontSize(10)
    .text(BRAND_PLACE, 200, 80, { align: 'right' })
    .moveDown();
};

// ======================================================================
// ======================================================================
// ========================= FOOTER FUNCTIONS ===========================
// ======================================================================
// ======================================================================

const generateFooterInvoce = (data: any, imagePath: string) => {
  return data
    .image(imagePath, 140, 775, { width: 20, align: 'center' }) // (text, x, y, options)
    .fontSize(10)
    .text(FOOTER_TEXT, 50, 780, {
      align: 'center',
      width: 500,
    });
};

// ======================================================================
// ======================================================================
// =========================== HR FUNCTIONS =============================
// ======================================================================
// ======================================================================

const generateHr = (
  doc: any,
  y: number,
  xInit: number = 50,
  xEnd: number = 550
) => {
  return doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(xInit, y)
    .lineTo(xEnd, y)
    .stroke();
};

const generateCustomerInformation = (data: any, invoice: IInvoiceData) => {
  data = data
    .fillColor('#444444')
    .fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#33658a')
    .text('Customer Info', 50, 130);
  data = generateHr(data, 155);
  data = data
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#33658a')
    .text(`Name:`, 50, 170)
    .fontSize(12)
    .font('Helvetica')
    .fillColor('#000000')
    .text(`${invoice.customer.userName}`, 90, 170)
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#33658a')
    .text(`Mail:`, 50, 190)
    .fontSize(12)
    .font('Helvetica')
    .fillColor('#000000')
    .text(`${invoice.customer.email}`, 85, 190)
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#33658a')
    .text(`Date:`, 50, 210)
    .fontSize(12)
    .font('Helvetica')
    .fillColor('#000000')
    .text(`${format(invoice.invoice.paidAt, 'PPpp')}`, 85, 210)
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#33658a')
    .text(`Fees:`, 50, 230)
    .fontSize(12)
    .font('Helvetica')
    .fillColor('#000000')
    .text(`${invoice.invoice.share}`, 85, 230)

    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#33658a')
    .text('Address:', 300, 170)
    .fontSize(12)
    .font('Helvetica')
    .fillColor('#000000')
    .text(invoice.shipping.address, 357, 170)
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#33658a')
    .text('Shipment:', 300, 190)
    .fontSize(12)
    .font('Helvetica')
    .fillColor('#000000')
    .text(invoice.shipping.shippingMethod, 363, 190)
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#33658a')
    .text(`Destination:`, 300, 210)
    .fontSize(12)
    .font('Helvetica')
    .fillColor('#000000')
    .text(`${invoice.shipping.city} - ${invoice.shipping.country}`, 372, 210)
    .moveDown();
  return generateHr(data, 255);
};

const generateRow = (
  label: string,
  fontSize: number,
  font: string,
  width: number,
  align: string,
  x: number,
  y: number
) => {
  return {
    label,
    fontSize,
    font,
    width,
    align,
    x,
    y,
  };
};

const generateTableInvoice = (
  docContext: any,
  width: number,
  content: IPdfTable<any>
) => {
  docContext = docContext
    .fontSize(content.titleFontSize)
    .font('Helvetica-Bold')
    .fillColor('#33658a')
    .text(content.title, content.xInit, content.tablePosition)
    .fontSize(content.subtitleFontSize)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text(
      content.subtitle,
      content.xInit,
      content.tablePosition + content.yOffset
    );
  const initWidth = content.initWidth.map((initWidth, index) =>
    index === 0 ? content.xInit : content.xInit + width * initWidth
  );
  const spacing = content.spacing.map(spacing => spacing * width);
  const yHeaderLevel = content.tablePosition + content.yOffset * 2.5;
  const headers = content.header.map((header, index) => {
    return generateRow(
      header,
      content.headerFontSize,
      content.headerFontFamily,
      spacing[index],
      content.aling[index],
      initWidth[index],
      yHeaderLevel
    );
  });
  //GENERATE TABLE ROWS HEADER
  docContext = generateTableRow(docContext, headers);
  docContext = generateHr(docContext, yHeaderLevel + content.yOffset);
  // GENERATE EVERY ROW PRODUCTS
  let position = yHeaderLevel;
  let isResume = false;
  let isLastRow = false;
  for (const [index, currentData] of content.content.entries()) {
    position += content.yOffset * 1.5;
    //GENERATE ROW WITH FOR DATA
    if (index === content.content.length - content.resumeRows) {
      isResume = true;
    }
    if (index === content.content.length - 1) {
      isLastRow = true;
    }
    const row = [];
    for (const iterator of content.header.entries()) {
      const newItem = generateRow(
        currentData[content.nameRow[iterator[0]]],
        content.contentFontSize,
        content.contentFontFamily,
        spacing[iterator[0]],
        content.aling[iterator[0]],
        initWidth[iterator[0]],
        position
      );
      row.push(newItem);
    }
    docContext = generateTableRow(docContext, row);
    if (!isLastRow) {
      const initialPosition = isResume
        ? initWidth[content.header.length - 2]
        : initWidth[0];
      docContext = generateHr(
        docContext,
        position + content.yOffset,
        initialPosition
      );
    }
  }
  return docContext;
};

function generateTableRow(data, headers) {
  headers.forEach(header => {
    data = data
      .fontSize(header.fontSize)
      .font(header.font)
      .text(header.label, header.x, header.y, {
        width: header.width,
        align: header.align,
      });
  });
  return data;
}
