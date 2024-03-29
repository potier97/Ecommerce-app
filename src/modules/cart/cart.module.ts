import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//SERVICES
import { CartService } from './services/cart.service';
import { CartController } from './controllers/cart.controller';
import { Cart, CartSchema } from './entities/cart.entity';
import { UserModule } from 'modules/user/user.module';
import { ProductModule } from 'modules/product/product.module';

@Module({
  imports: [
    UserModule,
    ProductModule,
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: CartSchema,
      },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
