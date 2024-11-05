import { Customer } from "@/app/types/customer";
import { withNullSelectOption } from "@/app/utils/with-null-select";
import _ from "lodash";

export const createOrderSchema = (customers: Customer[], id?: string) => {
    return {
        type: "object",
        properties: {
            id: { type: "string", title: "ID", default: id },
            customerId: {
                title: "Customer",
                type: ["string", "null"],
                oneOf: withNullSelectOption(
                    _(customers)
                        .map((customer) => ({ const: customer.id, title: customer.name }))
                        .sortBy("title")
                        .value()
                ),
            },
            orderDate: { type: "string", title: "Order Date", format: "date" },
            expectedDeliveryDate: { type: "string", title: "Expected Delivery Date", format: "date" },
            nature: {
                type: "string",
                title: "Nature of Order",
                enum: ["Political", "Commercial", "Personal", "Other"]
            },
            status: {
                type: "string",
                title: "Order Status",
                enum: ["Pending", "Completed", "Canceled"]
            },
            notes: { type: "string", title: "Notes" },
        },
        required: ["customerId", "orderDate", "expectedDeliveryDate", "nature", "status"],
    };
}