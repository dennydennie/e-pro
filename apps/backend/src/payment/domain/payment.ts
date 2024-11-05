/* eslint-disable prettier/prettier */
import { Customer } from "src/customer/domain/customer";
import PaymentEntity, { CurrencyEnum, PaymentMethodEnum, PaymentStatusEnum } from "src/db/entity/payment.entity";
import { Order } from "src/order/domain/order";

export class PaymentDetail {
    readonly amount: number;
    readonly currency: CurrencyEnum;
    readonly status: PaymentStatusEnum;
    readonly method: PaymentMethodEnum;
    readonly customer: Customer;
    readonly order: Order;
    readonly date: Date;

    static fromEntity(entity: PaymentEntity): PaymentDetail {

        return {
            amount: entity.amount,
            currency: entity.currency,
            status: entity.status,
            method: entity.method,
            customer: Customer.fromEntity(entity.customer),
            order: Order.fromEntity(entity.order),
            date: entity.created,
        };
    }
}