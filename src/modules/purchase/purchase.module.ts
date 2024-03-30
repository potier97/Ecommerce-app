import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//SERVICES
import { PurchaseService } from './services/purchase.service';
import { PurchaseController } from './controllers/purchase.controller';
import { UserModule } from 'modules/user/user.module';
import { CartModule } from 'modules/cart/cart.module';
import { ProductModule } from 'modules/product/product.module';
//ENTITIES
import { Purchase, PurchaseSchema } from './entities/purchase.entity';

@Module({
  imports: [
    CartModule,
    UserModule,
    ProductModule,
    MongooseModule.forFeature([
      {
        name: Purchase.name,
        schema: PurchaseSchema,
      },
    ]),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}
