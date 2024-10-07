/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'The name of the customer',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email address of the customer',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The name of the contact person',
    example: 'Jane Smith',
  })
  @IsNotEmpty()
  @IsString()
  contactPerson: string;

  @ApiProperty({
    description: 'The mobile number of the contact person',
    example: '+263 (774) 1234567',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  contactPersonMobile: string;

  @ApiProperty({
    description: 'The shipping address of the customer',
    example: '123 Main St, Anytown Zimbabwe',
  })
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @ApiProperty({
    description: 'The latitude of the customer\'s shipping address',
    example: 40.730610,
  })
  @IsNotEmpty()
  shippingLatitude: number;

  @ApiProperty({
    description: 'The longitude of the customer\'s shipping address',
    example: -73.935242,
  })
  @IsNotEmpty()
  shippingLongitude: number;
}
