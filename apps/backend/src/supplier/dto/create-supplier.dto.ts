/* eslint-disable prettier/prettier */
import {
  IsString,
  IsDateString,
  IsLatitude,
  IsLongitude,
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

  @IsString()
  taxClearance: string;

  @IsDateString()
  taxExpiry: Date;

  @IsString()
  prazNumber: string;

  @IsString()
  vatNumber: string;
}
