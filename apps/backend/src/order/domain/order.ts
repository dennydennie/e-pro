/* eslint-disable prettier/prettier */
import { Customer } from "src/customer/domain/customer";
import { OrderEntity } from "src/db/entity/order.entity";

export class Order {
    readonly orderDate: Date;
    readonly expectedDeliveryDate: Date;
    readonly notes: string;
    readonly nature: string;
    readonly status: string;
    readonly customer: Customer;
    readonly id: string;


    static fromEntity(entity: OrderEntity): Order {
        return {
            orderDate: entity.orderDate,
            expectedDeliveryDate: entity.expectedDeliveryDate,
            notes: entity.notes,
            nature: entity.nature,
            status: entity.status,
            customer: Customer.fromEntity(entity.customer),
            id: entity.id,
        }
    }
}
