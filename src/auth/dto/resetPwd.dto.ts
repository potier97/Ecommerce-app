import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
//SHARED
import { Match } from 'shared/decorator/match/match.decorator';

export class ResetPwdDto {
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
  @MinLength(4)
  @MaxLength(20)
  @Match('password', { message: 'Las contraseñas no coinciden' })
  @ApiProperty({ description: 'Repetir Contraseña', example: 'Password123.' })
  readonly repeatPassword: string;

  //TOKEN
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(3)
  @ApiProperty({ description: 'Token de recuperación', example: '123' })
  readonly token: string;
}
