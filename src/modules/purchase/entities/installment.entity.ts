import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PaymentMethod } from 'shared/interfaces/paymentMethod.enum';

export type InstallmentDocument = HydratedDocument<Installment>;

@Schema()
export class Installment {
  //PAYMENT METHOD - FROM CLIENT
  @Prop({
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.OTHER,
    type: String,
  })
  public paymentMethod: string;

  //CURRENT INSTALLMENT - CALCULATED ON GENERATE
  @Prop({
    required: true,
    type: Number,
  })
  public installment: number;

  //AMOUNT TO PAY (PRINCIPAL + INTEREST) CALCULATED ON GENERATED
  @Prop({
    required: true,
    type: Number,
  })
  public amount: number;

  //AMOUNT - FROM CLIENT /  CAN BE GREATER THAN AMOUNT
  @Prop({
    required: true,
    type: Number,
  })
  public amountPaid: number;

  //INTEREST - CALLCULATED ON GENERATED
  @Prop({
    required: true,
    type: Number,
  })
  public interest: number;

  //REAL AMOUNT TO PAY - CALCUATED ON GENERATED
  @Prop({
    required: true,
    type: Number,
  })
  public principal: number;

  //CURRENT DEBT - CALCULATED ON GENERATED
  @Prop({
    required: true,
    type: Number,
  })
  public debt: number;

  //VALIDATE IF ALREADY PAID - FROM CLIENT
  @Prop({
    required: true,
    type: Boolean,
  })
  public payment: boolean;

  //VALIDATE IF PAYMENT IS DUE - FROM CLIENT
  @Prop({
    required: true,
    type: Boolean,
  })
  public overdue: boolean;

  //GENERATED PAYMENT DATE - CALCULATED ON GENERATED
  @Prop({
    required: true,
    type: Date,
  })
  public dueAt: Date;

  //DEADLINE DATE - CALCULATED ON GENERATED
  @Prop({
    required: true,
    type: Date,
  })
  public deadlineAt: Date;

  //PAYMENT DATE - FROM CLIENT
  @Prop({
    type: Date,
  })
  public paymentAt: Date;
}

export const InstallmentSchema = SchemaFactory.createForClass(Installment);
