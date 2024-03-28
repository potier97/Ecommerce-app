import { Injectable } from '@nestjs/common';
import { CreatePurchaseDetailDto } from '../dto/create-purchase-detail.dto';
import { UpdatePurchaseDetailDto } from '../dto/update-purchase-detail.dto';

@Injectable()
export class PurchaseDetailService {
  create(createPurchaseDetailDto: CreatePurchaseDetailDto) {
    return 'This action adds a new purchaseDetail';
  }

  findAll() {
    return `This action returns all purchaseDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseDetail`;
  }

  update(id: number, updatePurchaseDetailDto: UpdatePurchaseDetailDto) {
    return `This action updates a #${id} purchaseDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseDetail`;
  }
}
