/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateRawMaterialDto {
  @ApiProperty({
    description: 'The name of the raw material',
    example: 'Steel',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Detailed description of the raw material',
    example: 'High-grade steel for industrial use',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
