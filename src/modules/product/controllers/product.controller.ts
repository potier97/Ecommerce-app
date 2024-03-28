import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
// SERVICES
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/guard/jwt-auth/jwt-auth.guard';
import { CustomResponseDto } from 'shared/interfaces/customResponse.interface';
import { Product } from '../entities/product.entity';

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto
  ): Promise<CustomResponseDto<any>> {
    const data = await this.productService.create(createProductDto);
    return {
      content: data,
      message: 'Product created successfully',
      status: true,
    };
  }

  @Get()
  async findAll(): Promise<CustomResponseDto<Product[]>> {
    const result = await this.productService.findAll();
    return {
      content: result,
      message: 'All products',
      status: true,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CustomResponseDto<Product>> {
    const resault = await this.productService.findOne(id);
    return {
      content: resault,
      message: 'Product found',
      status: true,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<CustomResponseDto<Product>> {
    const result = await this.productService.update(id, updateProductDto);
    return {
      content: result,
      message: 'Product updated',
      status: true,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<CustomResponseDto<boolean>> {
    const result = await this.productService.remove(id);
    return {
      content: result,
      message: 'Product removed',
      status: true,
    };
  }

  @Get('category/:category')
  async findByCategory(
    @Param('category') category: string
  ): Promise<CustomResponseDto<Product[]>> {
    const result = await this.productService.findByCategory(category);
    return {
      content: result,
      message: 'Products found by category',
      status: true,
    };
  }

  @Post('publish/:id')
  async publish(@Param('id') id: string): Promise<CustomResponseDto<Product>> {
    const result = await this.productService.publish(id);
    return {
      content: result,
      message: 'Product published',
      status: true,
    };
  }

  @Post('unpublish/:id')
  async unpublish(
    @Param('id') id: string
  ): Promise<CustomResponseDto<Product>> {
    const result = await this.productService.unpublish(id);
    return {
      content: result,
      message: 'Product unpublished',
      status: true,
    };
  }

  @Post('schedule/:id')
  async schedule(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<CustomResponseDto<Product>> {
    const result = await this.productService.scheduleProduct(
      id,
      updateProductDto.publishedAt
    );
    return {
      content: result,
      message: 'Product scheduled',
      status: true,
    };
  }

  @Post('change-amout/:id')
  async addAmount(
    @Param('id') id: string,
    @Body('quantity') quantity: number
  ): Promise<CustomResponseDto<Product>> {
    const result = await this.productService.changeAmount(id, quantity);
    return {
      content: result,
      message: 'Amount added',
      status: true,
    };
  }
}
