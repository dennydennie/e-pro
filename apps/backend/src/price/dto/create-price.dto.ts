/* eslint-disable prettier/prettier */
import { IsNumber, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePriceDto {
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsUUID()
    @IsNotEmpty()
    supplierId: string;

    @IsUUID()
    @IsNotEmpty()
    rawMaterialId: string;
}
