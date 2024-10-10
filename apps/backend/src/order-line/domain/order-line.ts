/* eslint-disable prettier/prettier */
import { Order } from 'src/order/domain/order';
import { Product } from 'src/product/domain/product';

export class OrderLine {
    readonly id?: string;
    readonly order: Order;
    readonly product: Product;
    readonly quantity: number;

    static fromEntity(entity): OrderLine {
        return {
            id: entity.id,
            order: Order.fromEntity(entity.order), 
            product: Product.fromEntity(entity.product), 
            quantity: entity.quantity,
        };
    }
}