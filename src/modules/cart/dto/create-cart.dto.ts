import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ description: 'Id del producto' })
  readonly product: string;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Cantidad del producto que quiere comprar' })
  readonly quantity: number;
}

export class CreateCartDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateCartItemDto)
  @ApiProperty({
    type: () => CreateCartItemDto,
    description: 'Datos del producto a añadir',
  })
  public readonly product: CreateCartItemDto;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ description: 'Id del usuario' })
  public readonly userId: string;
}
