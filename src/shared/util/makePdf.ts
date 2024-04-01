import { Buffer } from 'buffer';
import { format } from 'date-fns';
import * as path from 'path';
import PDFDocument from 'pdfkit';
//INTERFACES
import { IInvoiceData } from 'shared/interfaces/invoiceData.interface';
import { IProduct } from 'shared/interfaces/products.interface';
import {
  BRAND_NAME,
  BRAND_PLACE,
  DOCUMENT_MARGIN,
  DOCUMENT_SIZE,
  FOOTER_TEXT,
  IMAGE_LOGO_PATH,
  RESUME_INVOICE_ITEMS_SHIPPING,
  RESUME_INVOICE_ITEMS_SUBTOTAL,
  RESUME_INVOICE_ITEMS_TAX,
  RESUME_INVOICE_ITEMS_TOTAL,
  URL_BRAND,
} from 'shared/constants/invoicePdf';

//INSPIRATED BY https://pspdfkit.com/blog/2019/generate-pdf-invoices-pdfkit-nodejs/
export const invoicePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer> => {
  //GENERATE A DOC OBJECT
  let doc = new PDFDocument({
    size: DOCUMENT_SIZE,
    margin: DOCUMENT_MARGIN,
    bufferPages: true,
  });
  //LOGO PATH
  const imagePath = path.join(__dirname, IMAGE_LOGO_PATH);

  //GENERATE HEADER AND FOOTER
  doc = generateHeaderInvoice(doc, imagePath, invoiceData['_id']);
  doc = generateFooterInvoce(doc, imagePath);
  //GENERATE CUSTOMER INFORMATION
  doc = generateCustomerInformation(doc, invoiceData);
  //UTIL WIDTH SPACE
  const width = doc['page'].width - 100;
  //GENERATE INVOICE TABLE
  const invoiceListData = invoiceData.products;
  //ADD RESUME DATA PAYMENT
  invoiceListData.push({
    name: RESUME_INVOICE_ITEMS_SUBTOTAL,
    price: invoiceData.invoice.subtotal,
    quantity: 0,
    tax: 0,
  });
  invoiceListData.push({
    name: RESUME_INVOICE_ITEMS_TAX,
    price: invoiceData.invoice.tax,
    quantity: 0,
    tax: 0,
  });
  invoiceListData.push({
    name: RESUME_INVOICE_ITEMS_SHIPPING,
    price: invoiceData.shipping.shippingCost,
    quantity: 0,
    tax: 0,
  });
  invoiceListData.push({
    name: RESUME_INVOICE_ITEMS_TOTAL,
    price: invoiceData.invoice.total,
    quantity: 0,
    tax: 0,
  });

  doc = generateTableInvoice(doc, 290, width, invoiceListData);

  // Finaliza el documento y devuelve el buffer
  return new Promise<Buffer>((resolve, reject) => {
    const buffers: Uint8Array[] = [];
    doc.on('data', (chunk: Uint8Array) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
    doc.end();
  });
};

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
  data: any,
  yLevel: number,
  width: number,
  products: IProduct[]
) => {
  data = data
    .fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#33658a')
    .text(`Purchased Items`, 50, yLevel)
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text(`Description`, 50, yLevel + 20);
  const headerNames = ['Product', 'Price', 'Amount', 'Tax', 'Total'];
  const headerNamesWidth = [
    width * 0.4,
    width * 0.15,
    width * 0.15,
    width * 0.15,
    width * 0.15,
  ];
  const headerInitWidth = [
    50,
    50 + width * 0.4,
    50 + width * 0.55,
    50 + width * 0.7,
    50 + width * 0.85,
  ];
  const headerFontSize = 14;
  const ySpaceStep = 20;
  const yHeaderLevel = yLevel + ySpaceStep * 2.3;
  const headers = headerNames.map((header, index) => {
    return generateRow(
      header,
      headerFontSize,
      'Helvetica-Bold',
      headerNamesWidth[index],
      header === headerNames[0] ? 'left' : 'right',
      headerInitWidth[index],
      yHeaderLevel
    );
  });
  //GENERATE TABLE ROWS HEADER
  data = generateTableRow(data, headers);
  data = generateHr(data, yHeaderLevel + ySpaceStep);
  const fontDataRowSize = 12;
  // GENERATE EVERY ROW PRODUCTS
  let position = yHeaderLevel;
  const productLength = products.length;
  let isResume = false;
  let isLastRow = false;
  for (const [index, product] of products.entries()) {
    const font = 'Helvetica';
    position += ySpaceStep * 1.5;
    //VALIDA SI SON LOS ULTIMOS 4 REGISTROS EN LA LISTA DE PRODUCTOS
    if (index >= productLength - 4) {
      isResume = true;
    }
    //VALIDA LAST ROW
    if (productLength === index + 1) {
      isLastRow = true;
    }
    //GENERATE ROW
    const row = [
      generateRow(
        isResume ? '' : product.name,
        fontDataRowSize,
        font,
        headerNamesWidth[0],
        'left',
        headerInitWidth[0],
        position
      ),
      generateRow(
        isResume ? '' : `$ ${(product.price - product.tax).toString()}`,
        fontDataRowSize,
        font,
        headerNamesWidth[1],
        'right',
        headerInitWidth[1],
        position
      ),
      generateRow(
        isResume ? '' : product.quantity.toString(),
        fontDataRowSize,
        font,
        headerNamesWidth[2],
        'right',
        headerInitWidth[2],
        position
      ),
      generateRow(
        isResume ? product.name : `$ ${product.tax.toString()}`,
        fontDataRowSize,
        font,
        headerNamesWidth[3],
        'right',
        headerInitWidth[3],
        position
      ),
      generateRow(
        isResume
          ? `$ ${product.price.toString()}`
          : `$ ${(product.price * product.quantity).toString()}`,
        fontDataRowSize,
        font,
        headerNamesWidth[4],
        'right',
        headerInitWidth[4],
        position
      ),
    ];
    data = generateTableRow(data, row);
    if (!isLastRow) {
      const initialPosition = isResume
        ? headerInitWidth[2]
        : headerInitWidth[0];
      data = generateHr(data, position + ySpaceStep, initialPosition);
    }
  }
  return data;
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

const generateFooterInvoce = (data: any, imagePath: string) => {
  return data
    .image(imagePath, 140, 775, { width: 20, align: 'center' }) // (text, x, y, options)
    .fontSize(10)
    .text(FOOTER_TEXT, 50, 780, {
      align: 'center',
      width: 500,
    });
};

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
