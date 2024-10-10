import { Product } from "@/app/types/product";
import { withNullSelectOption } from "@/app/utils/with-null-select";
import _ from "lodash";

export const createOrderLineSchema = (products: Product[], orderId: string, id?: string) => {
    return {
        type: "object",
        properties: {
            id: { type: "string", title: "ID", default: id },
            orderId: { type: "string", title: "Order ID", default: orderId },
            productId: {
                type: ["string", "null"],
                title: "Product",
                oneOf: withNullSelectOption(
                    _(products)
                        .map((product) => ({ const: product.id, title: product.name }))
                        .sortBy("title")
                        .value()
                ),
            },
            quantity: { type: "number", title: "Quantity" },
        },
        required: ["productId", "quantity"],
    };
};