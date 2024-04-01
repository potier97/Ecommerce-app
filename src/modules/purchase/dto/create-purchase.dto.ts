import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { PaymentMethod } from 'shared/interfaces/paymentMethod.enum';
import { ShippingMethod } from 'shared/interfaces/shippingMethod.enum';
import { validInstallments } from 'shared/util/installments';

export class CreatePurchaseDto {
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @ApiProperty({ description: 'Métodos de pago' })
  public readonly paymentMethod: PaymentMethod;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(ShippingMethod)
  @ApiProperty({ description: 'Métodos de envío' })
  public readonly shippingMethod: ShippingMethod;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Direccion de envio' })
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Ciudad de envio' })
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Pais de envio' })
  readonly country: string;

  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Estado de financiamiento (0) de contado - (1) financiado',
  })
  public readonly financed: boolean;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(36)
  @IsIn(validInstallments, { message: 'Invalid installment value' })
  @ApiProperty({ description: 'Número de cuotas a financiar' })
  public readonly share: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(10000000000000000)
  @ApiProperty({ description: 'Pago Inicial de la compra' })
  public readonly initialPayment: number;
}
