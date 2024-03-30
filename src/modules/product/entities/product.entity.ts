import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CategoryProducts } from 'shared/interfaces/categoryProducts.enum';

export type ProductsDocument = HydratedDocument<Product>;

@Schema({
  collection: 'product',
  timestamps: true,
})
export class Product {
  @Prop({
    unique: true,
    required: true,
    minlength: 3,
    type: String,
  })
  public name: string;

  @Prop({
    required: true,
    minlength: 3,
    type: String,
  })
  public description: string;

  @Prop({
    required: true,
    type: Number,
  })
  public quantity: number;

  @Prop({
    required: true,
    enum: Object.values(CategoryProducts),
    default: CategoryProducts.UNCATEGORIZED,
    type: String,
  })
  public category: string;

  @Prop({
    required: true,
    type: Number,
  })
  public price: number;

  @Prop({
    required: true,
    default: 0,
    type: Number,
  })
  public tax: number;

  @Prop({
    required: true,
    default: true,
    type: Boolean,
  })
  public active: boolean;

  @Prop({
    required: true,
    default: false,
    type: Boolean,
  })
  public published: boolean;

  @Prop({
    required: true,
    default: new Date(),
    type: Date,
  })
  public publishedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
