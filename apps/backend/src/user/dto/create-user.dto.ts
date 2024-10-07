/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '263 775 123 456',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main St, Anytown Zimbabwe',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'The department of the user',
    example: 'Production',
  })
  @IsOptional()
  @IsString()
  department: string;
}
