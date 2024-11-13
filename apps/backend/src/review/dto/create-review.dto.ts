/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsUUID, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsUUID()
  supplierId: string;
}
