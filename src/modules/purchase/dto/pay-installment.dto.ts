import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { PaymentMethod } from 'shared/interfaces/paymentMethod.enum';

export class PayInstallmentDto {
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @ApiProperty({ description: 'Métodos de pago' })
  public readonly paymentMethod: PaymentMethod;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(10000000000000000)
  @ApiProperty({ description: 'Pago realizado en la cuota' })
  public readonly amountPaid: number;
}
