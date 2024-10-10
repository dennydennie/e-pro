import { Product } from "./product";
import { Warehouse } from "./warehouse";

export interface StockThreshold {
    id?: string;
    product: Product;
    warehouse: Warehouse;
    lowStockThreshold: number;
    highStockThreshold: number;
}