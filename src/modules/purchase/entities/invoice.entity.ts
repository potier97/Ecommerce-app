import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PaymentMethod } from 'shared/interfaces/paymentMethod.enum';

export type InvoiceInfoDocument = HydratedDocument<InvoiceInfo>;

@Schema()
export class InvoiceInfo {
  @Prop({
    required: true,
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.OTHER,
    type: String,
  })
  public paymentMethod: string;

  @Prop({
    required: true,
    type: Boolean,
  })
  public paid: boolean;

  @Prop({
    required: true,
    type: Boolean,
  })
  public financed: boolean;

  @Prop({
    required: true,
    type: Number,
    default: 1,
  })
  public share: number;

  @Prop({
    required: true,
    type: Number,
    default: 1,
  })
  public currentShare: number;

  @Prop({
    required: true,
    type: Number,
  })
  public tax: number;

  @Prop({
    required: true,
    type: Number,
  })
  public subtotal: number;

  @Prop({
    required: true,
    type: Number,
  })
  public otherCosts: number;

  @Prop({
    required: true,
    type: Number,
  })
  public total: number;

  @Prop({
    required: true,
    type: Number,
  })
  public debt: number;

  @Prop({
    required: true,
    type: Number,
  })
  public interest: number;

  @Prop({
    required: true,
    type: Date,
  })
  public paidAt: Date;
}

export const InvoiceInfoSchema = SchemaFactory.createForClass(InvoiceInfo);
