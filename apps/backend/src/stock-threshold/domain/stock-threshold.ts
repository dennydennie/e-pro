/* eslint-disable prettier/prettier */
import { Product } from "src/product/domain/product";
import { Warehouse } from "src/warehouse/domain/warehouse";

export class StockThresholdDetail {
    id: string;
    readonly product: Product;
    readonly warehouse: Warehouse;
    readonly lowStockThreshold: number;
    readonly highStockThreshold: number;

    static fromEntity(entity: any): StockThresholdDetail {
        return {
            id: entity.id,
            product: Product.fromEntity(entity.product),
            warehouse: Warehouse.fromEntity(entity.warehouse),
            lowStockThreshold: entity.lowStockThreshold,
            highStockThreshold: entity.highStockThreshold,
        };
    }
}