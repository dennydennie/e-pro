/* eslint-disable prettier/prettier */
import PaymentEntity, { CurrencyEnum, PaymentStatusEnum, PaymentMethodEnum } from "src/db/entity/payment.entity";

export class PaymentSummary {
    readonly amount: number;
    readonly currency: CurrencyEnum;
    readonly status: PaymentStatusEnum;
    readonly method: PaymentMethodEnum;
    readonly customerId: string;
    readonly orderId: string;
    readonly date: Date;

    static fromEntity(entity: PaymentEntity): PaymentSummary {
        return {
            amount: entity.amount,
            currency: entity.currency,
            status: entity.status,
            method: entity.method,
            customerId: entity.customer.id,
            orderId: entity.order.id,
            date: entity.created,
        };
    }
}