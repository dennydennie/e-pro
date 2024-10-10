/* eslint-disable prettier/prettier */
import { Product } from "src/product/domain/product";
import { Warehouse } from "src/warehouse/domain/warehouse";

export class Stock {
    id?: string;
    product: Product;
    warehouse: Warehouse;
    quantity: number;

    static fromEntity(entity): Stock {
        return {
            id: entity.id,
            product: entity.product,
            warehouse: entity.warehouse,
            quantity: entity.quantity
        }
    }
}