import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty({ description: 'Página de la consulta de los datos' })
  public readonly page: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty({ description: 'Numero de registros devueltos por cada página' })
  public readonly size: number;
}
