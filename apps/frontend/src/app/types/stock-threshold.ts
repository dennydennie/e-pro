export interface StockThreshold {
    id?: string;
    productId: string;
    warehouseId: string;
    lowStockThreshold: number;
    highStockThreshold: number;
}