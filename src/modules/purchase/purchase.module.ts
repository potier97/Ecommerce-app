import { Module } from '@nestjs/common';
import { PurchaseService } from './services/purchase.service';
import { PurchaseController } from './controllers/purchase.controller';

@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
