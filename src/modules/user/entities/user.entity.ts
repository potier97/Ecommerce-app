import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
//SHARED
import { Genre } from 'shared/interfaces/genre.enum';
import { UserType } from 'shared/interfaces/userType.enu';

export type UserDocument = User & Document;

@Schema({
  collection: 'user',
  timestamps: true,
})
export class User {
  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ default: '', type: String })
  secondName?: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ default: '', type: String })
  familyName?: string;

  @Prop({ required: true, unique: true, type: String, index: true })
  email: string;

  @Prop({ default: '', required: true, type: String })
  phone: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, enum: UserType, type: String })
  role: string;

  @Prop({ required: true, enum: Genre, type: String })
  genre: string;

  @Prop({ required: true, default: true, type: Boolean })
  status: boolean;

  @Prop({ required: true, default: false, type: Boolean })
  completedProfile: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
