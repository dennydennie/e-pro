/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { CurrencyEnum, PaymentStatusEnum, PaymentMethodEnum } from 'src/db/entity/payment.entity';

export class CreatePaymentDto {
    @ApiProperty({
        description: 'The payment amount',
        example: 150.00,
    })
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({
        description: 'The order ID associated with the payment',
        example: 'c8f3e62b-7e1e-4c1a-9b4c-5b6f2e1d1b2e',
    })
    @IsNotEmpty()
    @IsUUID()
    orderId: string;

    @ApiProperty({
        description: 'The currency of the payment',
        example: CurrencyEnum.USD,
        enum: CurrencyEnum,
    })
    @IsNotEmpty()
    @IsEnum(CurrencyEnum)
    currency: CurrencyEnum;

    @ApiProperty({
        description: 'The status of the payment',
        example: PaymentStatusEnum.SUCCESS,
        enum: PaymentStatusEnum,
    })
    @IsNotEmpty()
    @IsEnum(PaymentStatusEnum)
    status: PaymentStatusEnum;

    @ApiProperty({
        description: 'The method of payment',
        example: PaymentMethodEnum.CASH,
        enum: PaymentMethodEnum,
    })
    @IsNotEmpty()
    @IsEnum(PaymentMethodEnum)
    method: PaymentMethodEnum;
}