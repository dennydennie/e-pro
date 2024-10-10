/* eslint-disable prettier/prettier */

export class StockThresholdSummary {
    id: string;
    readonly productId: string;
    readonly warehouseId: string;
    readonly lowStockThreshold: number;
    readonly highStockThreshold: number;

    static fromEntity(entity: any): StockThresholdSummary {
        return {
            id: entity.id,
            productId: entity.product.id,
            warehouseId: entity.warehouse.id,
            lowStockThreshold: entity.lowStockThreshold,
            highStockThreshold: entity.highStockThreshold,
        };
    }
}