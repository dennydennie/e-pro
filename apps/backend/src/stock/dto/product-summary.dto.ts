/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class ProductSummaryDto {
  @IsNotEmpty()
  id: string;

  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  mass?: number;

  @IsOptional()
  @IsNumber()
  volume?: number;

  @IsOptional()
  @IsString()
  dimensions?: string;
}
