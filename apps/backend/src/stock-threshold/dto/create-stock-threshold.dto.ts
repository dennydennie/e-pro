/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';


export class CreateStockThresholdDto {
  @ApiProperty({
    description: 'The product ID',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'The warehouse ID',
    example: 'x1y2z3a4-b5c6-d7e8-f9g0',
  })
  @IsNotEmpty()
  @IsUUID()
  warehouseId: string;

  @ApiProperty({
    description: 'The low stock threshold',
    example: 50,
  })
  @IsNotEmpty()
  @IsNumber()
  lowStockThreshold: number;

  @ApiProperty({
    description: 'The high stock threshold',
    example: 500,
  })
  @IsNotEmpty()
  @IsNumber()
  highStockThreshold: number;
}
