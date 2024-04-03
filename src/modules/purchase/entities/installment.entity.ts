import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PaymentMethod } from 'shared/interfaces/paymentMethod.enum';

export type InstallmentDocument = HydratedDocument<Installment>;

@Schema()
export class Installment {
  //PAYMENT METHOD
  @Prop({
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

  //AMOUNT TO PAY (PRINCIPAL + INTEREST) CALCULATED
  @Prop({
    required: true,
    type: Number,
  })
  public amount: number;

  //AMOUNT FROM CLIENT
  @Prop({
    required: true,
    type: Number,
  })
  public amountPaid: number;

  //INTEREST
  @Prop({
    required: true,
    type: Number,
  })
  public interest: number;

  //REAL AMOUNT TO PAY
  @Prop({
    required: true,
    type: Number,
  })
  public principal: number;

  //CURRENT DEBT
  @Prop({
    required: true,
    type: Number,
  })
  public debt: number;

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

  @Prop({
    required: true,
    type: Date,
  })
  public deadlineAt: Date;

  //PAYMENT DATE
  @Prop({
    type: Date,
  })
  public paymentAt: Date;
}

export const InstallmentSchema = SchemaFactory.createForClass(Installment);
