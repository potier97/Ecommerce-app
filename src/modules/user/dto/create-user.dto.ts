import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsDefined,
  IsEnum,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
//SHARED
import { UserType } from 'shared/interfaces/userType.enu';
import { Genre } from 'shared/interfaces/genre.enum';
import { Match } from 'shared/decorator/match/match.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Nombre', example: 'John' })
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @ApiProperty({ description: 'Segundo Nombre', example: 'Doe' })
  readonly secondName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Primer Apellido', example: 'Smith' })
  readonly lastName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @ApiProperty({ description: 'Segundo Apellido', example: 'Doe' })
  readonly familyName?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    description: 'Correo electrónico',
    example: 'john@example.com',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  @ApiProperty({
    description: 'Número de teléfono',
    example: '3000000000',
  })
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número',
  })
  @ApiProperty({ description: 'Contraseña', example: 'Password123' })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Match('password', { message: 'Las contraseñas no coinciden' })
  @ApiProperty({ description: 'Repetir Contraseña', example: 'Password123' })
  readonly repeatPassword: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(UserType)
  @ApiProperty({ description: 'Tipo de usuario', example: UserType.ADMIN })
  public readonly role: UserType;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(Genre)
  @ApiProperty({ description: 'Genero de usuario', example: Genre.MASCULINO })
  public readonly genre: Genre;
}
