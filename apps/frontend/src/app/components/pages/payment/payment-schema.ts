import { CurrencyEnum, PaymentMethodEnum, PaymentStatusEnum } from "@/app/types/enums";
import { Order } from "@/app/types/order";
import _ from "lodash";

export const createPaymentSchema = (orders: Order[], id?: string) => {
    return {
        type: "object",
        properties: {
            id: { type: "string", title: "ID", default: id },
            orderId: {
                title: "Order",
                type: "string",
                oneOf: [
                    { const: "", title: "Select an order" },
                    ...orders.map((order) => ({ const: order.id, title: `${order.customer.name} - ${new Date(order.orderDate).toLocaleDateString()}` })),
                ],
            },
            amount: {
                type: "number",
                title: "Payment Amount",
                minimum: 0,
            },
            currency: {
                title: "Currency",
                oneOf: Object.values(CurrencyEnum).map(value => ({
                    const: value,
                    title: value,
                })),
                enum: Object.values(CurrencyEnum),
            },
            status: {
                title: "Payment Status",
                oneOf: Object.values(PaymentStatusEnum).map(value => ({
                    const: value,
                    title: value,
                })),
                enum: Object.values(PaymentStatusEnum),
            },
            method: {
                title: "Payment Method",
                oneOf: Object.values(PaymentMethodEnum).map(value => ({
                    const: value,
                    title: value,
                })),
                enum: Object.values(PaymentMethodEnum),
            },
        },
        required: ["amount", "orderId", "currency", "status", "method"],
    };
};