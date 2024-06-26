import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsInMailWitheList } from 'shared/decorator/mail-withe-list/mail-withe-list.decorator';
//SHARED
import { Match } from 'shared/decorator/match/match.decorator';
import { Genre } from 'shared/interfaces/genre.enum';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Primer Nombre', example: 'John' })
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Primer Apellido', example: 'Smith' })
  readonly lastNasme: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @IsInMailWitheList({ message: 'Correo no permitido' })
  @IsEmail()
  @ApiProperty({ description: 'Correo Usuario' })
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número',
  })
  @ApiProperty({ description: 'Contraseña Usuario', example: 'Password123.' })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  @Matches(/^[0-9]*$/, { message: 'El teléfono solo puede contener números' })
  @ApiProperty({ description: 'Telefono Usuario' })
  public readonly phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Match('password', { message: 'Las contraseñas no coinciden' })
  @ApiProperty({ description: 'Repetir Contraseña', example: 'Password123.' })
  readonly repeatPassword: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(Genre)
  @ApiProperty({ description: 'Genero de usuario', example: Genre.MASCULINO })
  public readonly genre: Genre;
}
