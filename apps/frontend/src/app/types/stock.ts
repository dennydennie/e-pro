import { Product } from "./product";
import { Warehouse } from "./warehouse";

export interface Stock {
    id?: string;
    product: Product;
    warehouse: Warehouse;
    quantity: number;
}