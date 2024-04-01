import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
//SERVICES
import { CartService } from '../services/cart.service';
import { CreateCartItemDto } from '../dto/create-cart.dto';
import { JwtAuthGuard } from 'auth/guard/jwt-auth/jwt-auth.guard';
import { CustomResponseDto } from 'shared/interfaces/customResponse.interface';
import { UpdateCartItemDto } from '../dto/update-cart.dto';
import { ICartList } from 'shared/interfaces/cartList.interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addProduct(
    @Request() req,
    @Body() createCartItemDto: CreateCartItemDto
  ): Promise<CustomResponseDto<any>> {
    //VALIDATE PRODUCT AMOUNT IS GREATER THAN 0
    if (createCartItemDto.quantity <= 0) {
      throw new BadRequestException({
        message: 'Product amount must be greater than 0',
        error: true,
        status: 400,
      });
    }
    const result = await this.cartService.addProduct(
      req.user.id,
      createCartItemDto
    );
    return {
      content: result,
      message: 'Product added to cart',
      status: true,
    };
  }

  @Get()
  async getCart(@Request() req): Promise<CustomResponseDto<ICartList[]>> {
    const result = await this.cartService.getCart(req.user.id);
    return {
      content: result,
      message: 'User Cart',
      status: true,
    };
  }

  @Post('remove')
  async removeProduct(
    @Request() req,
    @Body() updateCartItemDto: UpdateCartItemDto
  ): Promise<CustomResponseDto<boolean>> {
    const result = await this.cartService.removeProduct(
      req.user.id,
      updateCartItemDto
    );
    return {
      content: result,
      message: 'Product removed from cart',
      status: true,
    };
  }

  @Post('clean')
  async clearCart(@Request() req): Promise<CustomResponseDto<boolean>> {
    const result = await this.cartService.clearCart(req.user.id);
    return {
      content: result,
      message: 'Cart cleared',
      status: true,
    };
  }
}
