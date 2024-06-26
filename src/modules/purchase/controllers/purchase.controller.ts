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
  Res,
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
import { Response } from 'express';
import { IInvoiceData } from 'shared/interfaces/invoiceData.interface';
import { PayInstallmentDto } from '../dto/pay-installment.dto';

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
    try {
      const result = await this.purchaseService.findAll(params);
      return {
        content: result,
        message: 'All products',
        status: true,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message ? error.message : 'Error finding purchases',
          content: false,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', MongoIdPipe) id: string
  ): Promise<CustomResponseDto<IInvoiceData>> {
    try {
      const result = await this.purchaseService.findOne(id);
      return {
        content: result,
        message: `Purchase with id ${id} found`,
        status: true,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message ? error.message : 'Error finding purchase',
          content: false,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put('pay/:id/installment/:insId')
  async payInstallment(
    @Param('id', MongoIdPipe) id: string,
    @Param('insId', MongoIdPipe) insId: string,
    @Body() data: PayInstallmentDto
  ): Promise<CustomResponseDto<any>> {
    try {
      const result = await this.purchaseService.payInstallment(id, insId, data);
      return {
        content: result,
        message: `Installment ${insId} paid successfully`,
        status: true,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message ? error.message : 'Error paying installment',
          content: false,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('download-payment-plan/:id')
  async downloadPaymentPlan(
    @Res() res: Response,
    @Param('id', MongoIdPipe) id: string
  ) {
    try {
      const installmentPdfBuffer =
        await this.purchaseService.downloadPaymentPlan(id);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${installmentPdfBuffer.fileName}`,
        'content-length': installmentPdfBuffer.data.length.toString(),
      });
      res.send(installmentPdfBuffer.data).status(HttpStatus.OK);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message
            ? error.message
            : 'Error downloading payment plan',
          content: false,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('invoice-pdf/:id')
  async downloadInvoice(
    @Res() res: Response,
    @Param('id', MongoIdPipe) id: string
  ): Promise<void> {
    try {
      const invoicePdfBuffer = await this.purchaseService.downloadInvoice(id);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${invoicePdfBuffer.fileName}`,
        'content-length': invoicePdfBuffer.data.length.toString(),
      });
      res.send(invoicePdfBuffer.data).status(HttpStatus.OK);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message ? error.message : 'Error downloading invoice',
          content: false,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', MongoIdPipe) id: string
  ): Promise<CustomResponseDto<boolean>> {
    try {
      const result = await this.purchaseService.remove(id);
      return {
        content: result,
        message: `Purchase with id ${id} removed`,
        status: true,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message ? error.message : 'Error removing purchase',
          content: false,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
