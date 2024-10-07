/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFactoryDto {
  @ApiProperty({
    description: 'The name of the factory',
    example: 'ABC Manufacturing',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The address of the factory',
    example: '123 Main St, Anytown USA',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'The latitude of the factory location',
    example: 40.730610,
  })
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: 'The longitude of the factory location',
    example: -73.935242,
  })
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({
    description: 'The id for the factory manager',
    example: 'ABC Manufacturing',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The phone number of the factory',
    example: '+1 (555) 1234567',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
