import { Module } from '@nestjs/common';
import { PurchaseDetailService } from './services/purchase-detail.service';
import { PurchaseDetailController } from './controllers/purchase-detail.controller';

@Module({
  controllers: [PurchaseDetailController],
  providers: [PurchaseDetailService],
})
export class PurchaseDetailModule {}
