import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PurchaseDocument = HydratedDocument<Purchase>;

export class Purchase {}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
