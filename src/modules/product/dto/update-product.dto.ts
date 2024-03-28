import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  MinDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { setHours, setMinutes, subDays } from 'date-fns';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Min(0)
  @Max(1000000)
  @ApiProperty({ description: 'Categoria del Producto' })
  public readonly tax?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Producto activo' })
  public readonly active?: boolean;

  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Producto publicado' })
  public readonly published?: boolean;

  @IsNotEmpty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MinDate(setMinutes(setHours(subDays(new Date(), 1), 23), 59))
  @ApiProperty({ description: 'Fecha de publicación' })
  public readonly publishedAt?: Date;
}
