/* eslint-disable prettier/prettier */

export class OrderLineSummary {
    readonly id?: string;
    readonly orderId: string;
    readonly productId: string;
    readonly quantity: number;

    static fromEntity(entity): OrderLineSummary {
        return {
            id: entity.id,
            orderId: entity.order.id,
            productId: entity.product.id,
            quantity: entity.quantity,
        };
    }
}