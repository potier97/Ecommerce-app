import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ShippingMethod } from 'shared/interfaces/shippingMethod.enum';

export type ShippingInfoDocument = HydratedDocument<ShippingInfo>;

@Schema()
export class ShippingInfo {
  @Prop({
    required: true,
    enum: Object.values(ShippingMethod),
    default: ShippingMethod.OTHER,
    type: String,
  })
  shippingMethod: string;

  @Prop({
    required: true,
    type: String,
  })
  address: string;

  @Prop({
    required: true,
    type: String,
  })
  city: string;

  @Prop({
    required: true,
    type: String,
  })
  country: string;

  @Prop({
    required: true,
    type: Number,
  })
  public shippingCost: number;
}

export const ShippingInfoSchema = SchemaFactory.createForClass(ShippingInfo);
