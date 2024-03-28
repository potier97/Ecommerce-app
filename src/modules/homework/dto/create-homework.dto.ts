import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Status } from 'shared/interfaces/statusTask.enum';

export class CreateHomeworkDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Nombre de la tarea' })
  public readonly title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'descripcion de la tarea' })
  public readonly description: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ description: 'estado activo de la tarea' })
  public readonly active: boolean;

  @IsDefined()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(Status)
  @ApiProperty({ description: 'Id de la tarea' })
  public readonly status: Status;
}
