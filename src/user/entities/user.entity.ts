import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Genre } from 'src/shared/interfaces/genre.enum';
import { UserType } from 'src/shared/interfaces/userType.enu';

export type UserDocument = User & Document;

@Schema({
  collection: 'user',
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ default: '' })
  secondName?: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: '' })
  familyName?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserType })
  role: string;

  @Prop({ required: true, enum: Genre })
  genre: string;

  @Prop({ required: true, default: true })
  status: boolean;

  @Prop({ required: true, default: false })
  completedProfile: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
