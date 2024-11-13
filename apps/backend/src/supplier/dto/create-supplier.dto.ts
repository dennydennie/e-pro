/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lon: number;

  @IsString()
  contactNumber: string;

  @ApiProperty({
    description: 'The URL of the document',
    example: 'https://example.com/resume.pdf',
  })
  @IsNotEmpty()
  taxClearance: string;

  @IsDateString()
  taxExpiry: Date;

  @IsString()
  prazNumber: string;

  @IsString()
  vatNumber: string;
}
