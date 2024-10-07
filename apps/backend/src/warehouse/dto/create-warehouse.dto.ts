/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'The uuid for the factory',
    example: 'a817c9f9-667f-48fb-a6a4-8d75b36ea954',
  })
  @IsNotEmpty()
  @IsString()
  factoryId: string;

  @ApiProperty({
    description: 'The name of the warehouse',
    example: 'Main Warehouse',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The address of the warehouse',
    example: '123 Main St, Anytown USA',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'The latitude of the warehouse location',
    example: 40.730610,
  })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'The longitude of the warehouse location',
    example: -73.935242,
  })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty({
    description: 'The phone number of the warehouse',
    example: '+1 (555) 1234567',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'The maximum capacity of the warehouse (in square meters)',
    example: 10000,
  })
  @IsNotEmpty()
  @IsNumber()
  maxCapacity: number;
}
