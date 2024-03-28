import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PurchaseDetailService } from '../services/purchase-detail.service';
import { CreatePurchaseDetailDto } from '../dto/create-purchase-detail.dto';
import { UpdatePurchaseDetailDto } from '../dto/update-purchase-detail.dto';

@Controller('purchase-detail')
export class PurchaseDetailController {
  constructor(private readonly purchaseDetailService: PurchaseDetailService) {}

  @Post()
  create(@Body() createPurchaseDetailDto: CreatePurchaseDetailDto) {
    return this.purchaseDetailService.create(createPurchaseDetailDto);
  }

  @Get()
  findAll() {
    return this.purchaseDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseDetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseDetailDto: UpdatePurchaseDetailDto
  ) {
    return this.purchaseDetailService.update(+id, updatePurchaseDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseDetailService.remove(+id);
  }
}
