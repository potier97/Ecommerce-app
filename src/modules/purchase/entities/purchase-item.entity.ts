import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMongoose } from 'mongoose';
import { Product } from 'modules/product/entities/product.entity';
import { CategoryProducts } from 'shared/interfaces/categoryProducts.enum';

export type PurchaseItemDocument = HydratedDocument<PurchaseItem>;

@Schema()
export class PurchaseItem {
  @Prop({
    required: true,
    type: SchemaMongoose.Types.ObjectId,
    ref: Product.name,
  })
  public product: Product;

  @Prop({
    required: true,
    type: String,
  })
  public name: string;

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
}

export const PurchaseItemSchema = SchemaFactory.createForClass(PurchaseItem);
