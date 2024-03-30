import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Request,
  Query,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/guard/jwt-auth/jwt-auth.guard';
//SERVICES
import { PurchaseService } from '../services/purchase.service';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { MongoIdPipe } from 'shared/pipes/mongo-id/mongo-id.pipe';
import { Purchase } from '../entities/purchase.entity';
import { IPaginateData } from 'shared/interfaces/paginateData.interface';
import { PaginationDto } from 'shared/dtos/pagination.dto';
import { CustomResponseDto } from 'shared/interfaces/customResponse.interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('purchase')
@Controller('purchase')
export class PurchaseController {
  private readonly logger = new Logger(PurchaseController.name);

  constructor(private readonly purchaseService: PurchaseService) {}

  @Post('checkout')
  async checkout(
    @Request() req,
    @Body() createPurchaseDto: CreatePurchaseDto
  ): Promise<CustomResponseDto<string>> {
    try {
      const result = await this.purchaseService.checkout(
        req.user.id,
        createPurchaseDto
      );
      return {
        content: result,
        message: 'Purchase created successfully',
        status: true,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message ? error.message : 'Error creating purchase',
          content: false,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async findAll(
    @Query() params: PaginationDto
  ): Promise<CustomResponseDto<IPaginateData<Purchase>>> {
    const result = await this.purchaseService.findAll(params);
    return {
      content: result,
      message: 'All products',
      status: true,
    };
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.purchaseService.findOne(id);
  }

  @Put('pay-share/:id/share/:share')
  payShare(
    @Param('id', MongoIdPipe) id: string,
    @Param('shareId') share: number
  ) {
    return this.purchaseService.payShare(id, share);
  }

  @Post('download-invoice/:id')
  downloadInvoice(@Param('id', MongoIdPipe) id: string) {
    return this.purchaseService.downloadInvoice(id);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.purchaseService.remove(id);
  }
}
