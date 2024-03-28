import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
//INTERFACES
import { Status } from 'shared/interfaces/statusTask.enum';

export type HomeworkDocument = Homework & Document;

@Schema({
  collection: 'homework',
})
export class Homework {
  @Prop({ unique: true, required: true, minlength: 3 })
  public title: string;

  @Prop({ required: true, minlength: 3 })
  public description: string;

  @Prop({ required: true, default: true })
  public active: boolean;

  @Prop({ required: true, default: Status.OPEN })
  public status: Status;
}

export const HomeworkSchema = SchemaFactory.createForClass(Homework);
