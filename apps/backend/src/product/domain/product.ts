/* eslint-disable prettier/prettier */
import { ProductEntity } from "src/db/entity/product.entity";

export class Product {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly price: number;
    readonly expiryDate: Date;
    readonly unit: string;
    readonly mass?: number;
    readonly volume?: number;
    readonly dimensions?: string;

    static fromEntity(entity: ProductEntity): Product {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            price: entity.price,
            expiryDate: new Date(entity.expiryDate),
            unit: entity.unit,
            mass: entity.mass,
            volume: entity.volume,
            dimensions: entity.dimensions,
        };
    }
}