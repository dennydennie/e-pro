/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        description: 'The name of the product',
        example: 'Acme Widget',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The description of the product',
        example: 'A high-quality widget for all your needs',
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'The price of the product',
        example: 19.99,
    })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({
        description: 'Unit of measurement',
        example: 'kg or L',
    })
    @IsNotEmpty()
    @IsString()
    unit?: string;

    @ApiProperty({
        description: 'The mass of the product',
        example: 500,
    })
    @IsOptional()
    @IsNumber()
    mass: number;

    @ApiProperty({
        description: 'The volume of the product',
        example: 500,
    })
    @IsOptional()
    @IsNumber()
    volume: number;

    @ApiProperty({
        description: 'The dimensions of the product (length, width, height in cm)',
        example: '10 x 20 x 5',
    })
    @IsNotEmpty()
    @IsString()
    dimensions: string;

    @ApiProperty({
        description: 'The expiration date of the product',
        example: '2024-10-20T00:00:00Z',
    })
    @IsOptional()
    @IsDateString()
    expiryDate?: string;
}
