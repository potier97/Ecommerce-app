import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PurchaseItem, PurchaseItemSchema } from './purchase-item.entity';
import { Customer, CustomerSchema } from './customer.entity';
import { InvoiceInfo, InvoiceInfoSchema } from './invoice.entity';
import { ShippingInfo, ShippingInfoSchema } from './shipping-method.entity';
import { Installment, InstallmentSchema } from './installment.entity';

export type PurchaseDocument = HydratedDocument<Purchase>;

@Schema({
  collection: 'purchases',
  timestamps: true,
})
export class Purchase {
  @Prop({ type: [PurchaseItemSchema] })
  products: PurchaseItem[];

  @Prop({ type: CustomerSchema, required: true })
  customer: Customer;

  @Prop({ type: InvoiceInfoSchema, required: true })
  invoice: InvoiceInfo;

  @Prop({ type: [InstallmentSchema] })
  installments: Installment[];

  @Prop({ type: ShippingInfoSchema, required: true })
  shipping: ShippingInfo;

  @Prop({ required: true, type: Boolean, default: true })
  active: boolean;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
