/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class CreateOrderLineDto {
  @ApiProperty({
    description: 'The order ID',
    example: 'b51f2fc9-3463-4ae9-af2f-e523aca8eed5',
  })
  @IsNotEmpty()
  @IsUUID()
  orderId: string;

  @ApiProperty({
    description: 'The product ID',
    example: 'd790f1a7-3dbc-42ea-b82b-7ed324211154',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'The quantity of the product ordered',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
