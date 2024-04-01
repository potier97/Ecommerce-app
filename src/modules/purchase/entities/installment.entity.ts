import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PaymentMethod } from 'shared/interfaces/paymentMethod.enum';

export type InstallmentDocument = HydratedDocument<Installment>;

@Schema()
export class Installment {
  //PAYMENT METHOD
  @Prop({
    required: true,
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.OTHER,
    type: String,
  })
  public paymentMethod: string;

  //CURRENT INSTALLMENT
  @Prop({
    required: true,
    type: Number,
  })
  public installment: number;

  //AMOUNT TO PAY
  @Prop({
    required: true,
    type: Number,
  })
  public amount: number;

  //VALIDATE IF ALREADY PAID
  @Prop({
    required: true,
    type: Boolean,
  })
  public payment: boolean;

  //VALIDATE IF PAYMENT IS DUE
  @Prop({
    required: true,
    type: Boolean,
  })
  public overdue: boolean;

  //GENERATED PAYMENT DATE
  @Prop({
    required: true,
    type: Date,
  })
  public dueAt: Date;

  //PAYMENT DATE
  @Prop({
    required: true,
    type: Date,
  })
  public paymentAt: Date;
}

export const InstallmentSchema = SchemaFactory.createForClass(Installment);
