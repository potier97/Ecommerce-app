import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsInMailWitheList } from 'shared/decorator/mail-withe-list/mail-withe-list.decorator';

export class ForgotPwdDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @IsInMailWitheList({ message: 'Correo no permitido' })
  @IsEmail()
  @ApiProperty({ description: 'Correo Usuario' })
  public readonly email: string;
}
