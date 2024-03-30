import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMongoose } from 'mongoose';
import { User } from 'modules/user/entities/user.entity';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {
  @Prop({
    required: true,
    type: SchemaMongoose.Types.ObjectId,
    ref: User.name,
    index: true,
  })
  userId: User;

  @Prop({
    required: true,
    type: String,
  })
  userName: string;

  @Prop({
    required: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
  })
  phone: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
