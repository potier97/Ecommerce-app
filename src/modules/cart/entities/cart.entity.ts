import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMongoose } from 'mongoose';
import { CartItem, CartItemSchema } from './cart-item.entity';
import { User } from 'modules/user/entities/user.entity';

export type CartDocument = HydratedDocument<Cart>;

@Schema({
  collection: 'cart',
  timestamps: true,
})
export class Cart {
  @Prop({ type: [CartItemSchema] })
  products: CartItem[];

  @Prop({
    required: true,
    type: SchemaMongoose.Types.ObjectId,
    ref: User.name,
    index: true,
    unique: true,
  })
  userId: User;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
