import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseDetailService } from './purchase-detail.service';

describe('PurchaseDetailService', () => {
  let service: PurchaseDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseDetailService],
    }).compile();

    service = module.get<PurchaseDetailService>(PurchaseDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
