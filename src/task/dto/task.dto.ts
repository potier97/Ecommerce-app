import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { Status } from '../model/taks';

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nombre de la tarea' })
  public readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'descripcion de la tarea' })
  public readonly description: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ description: 'estado activo de la tarea' })
  public readonly active: boolean;
}

export class UpdateTaskDto extends PartialType(TaskDto) {
  @IsDefined()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(Status)
  @ApiProperty({ description: 'Id de la tarea' })
  public readonly status: Status;
}
