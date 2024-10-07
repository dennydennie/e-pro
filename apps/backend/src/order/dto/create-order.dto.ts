/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsDate, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The customer ID',
    example: 'e02bbc62-b429-4604-8cc5-2034187cca55',
  })
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @ApiProperty({
    description: 'The order date',
    example: '2023-04-25',
  })
  @IsNotEmpty()
  @IsDate()
  orderDate: Date;

  @ApiProperty({
    description: 'The expected delivery date',
    example: '2023-05-02',
  })
  @IsNotEmpty()
  @IsDate()
  expectedDeliveryDate: Date;

  @ApiProperty({
    description: 'The order notes',
    example: 'some extra detail about the order',
  })
  @IsNotEmpty()
  @IsString()
  notes: string;

  @ApiProperty({
    description: 'The order nature',
    example: 'political',
  })
  @IsNotEmpty()
  @IsString()
  nature: string;

  @ApiProperty({
    description: 'The order status',
    example: 'pending',
  })
  @IsNotEmpty()
  @IsString()
  status: string;
}
