import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseDetailController } from './purchase-detail.controller';
import { PurchaseDetailService } from '../services/purchase-detail.service';

describe('PurchaseDetailController', () => {
  let controller: PurchaseDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseDetailController],
      providers: [PurchaseDetailService],
    }).compile();

    controller = module.get<PurchaseDetailController>(PurchaseDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
