import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//SERVICES
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { Product, ProductSchema } from './entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
