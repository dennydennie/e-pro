import { Order } from "./order";
import { Product } from "./product";

export interface OrderLine {
    id?: string;
    order: Order;
    product: Product;
    quantity: number;
}


export interface OrderLineSummary {
    id?: string;
    orderId: string;
    productId: string;
    quantity: number;
}