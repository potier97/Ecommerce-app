import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CategoryProducts } from 'shared/interfaces/categoryProducts.enum';

export type ProductsDocument = Product & Document;

@Schema({
  collection: 'product',
  timestamps: true,
})
export class Product {
  @Prop({
    unique: true,
    required: true,
    minlength: 3,
  })
  public name: string;

  @Prop({
    required: true,
    minlength: 3,
  })
  public description: string;

  @Prop({
    required: true,
  })
  public quantity: number;

  @Prop({
    required: true,
    enum: Object.values(CategoryProducts),
    default: CategoryProducts.UNCATEGORIZED,
  })
  public category: string;

  @Prop({
    required: true,
  })
  public price: number;

  @Prop({
    required: true,
    default: 0,
  })
  public tax: number;

  @Prop({
    required: true,
    default: true,
  })
  public active: boolean;

  @Prop({
    required: true,
    default: false,
  })
  public published: boolean;

  @Prop({
    required: true,
    default: new Date(),
  })
  public publishedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
