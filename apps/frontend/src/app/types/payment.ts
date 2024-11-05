import { Customer } from "./customer";
import { CurrencyEnum, PaymentStatusEnum, PaymentMethodEnum } from "./enums";
import { Order } from "./order";

export interface Payment {
    id?: string;
    amount: number;
    orderId: string;
    currency: CurrencyEnum;
    status: PaymentStatusEnum;
    method: PaymentMethodEnum;
}


export interface PaymentDetail {
    id?: string;
    amount: number;
    customer: Customer;
    order: Order;
    currency: CurrencyEnum;
    status: PaymentStatusEnum;
    method: PaymentMethodEnum;
    date: Date;
}