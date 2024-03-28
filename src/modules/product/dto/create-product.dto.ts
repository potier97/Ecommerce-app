import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  Min,
  IsInt,
  Max,
  IsEnum,
  IsOptional,
  IsDefined,
} from 'class-validator';
import { CategoryProducts } from 'shared/interfaces/categoryProducts.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Nombre del producto' })
  public readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Cantidad del producto' })
  public readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsInt()
  @Max(100000)
  @ApiProperty({ description: 'Cantidad del producto' })
  public readonly quantity: number;

  @IsDefined()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(CategoryProducts)
  @ApiProperty({ description: 'Categoria del Producto' })
  public readonly category: CategoryProducts;

  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  @IsInt()
  @Max(10000000)
  @ApiProperty({ description: 'Precio del producto' })
  public readonly price: number;
}
