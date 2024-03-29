import { PartialType } from '@nestjs/swagger';
import { CreateCartDto, CreateCartItemDto } from './create-cart.dto';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {}

export class UpdateCartDto extends PartialType(CreateCartDto) {}
