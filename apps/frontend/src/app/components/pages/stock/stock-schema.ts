import { Product } from "@/app/types/product"; 
import { Warehouse } from "@/app/types/warehouse";
import { withNullSelectOption } from "@/app/utils/with-null-select";
import _ from "lodash";

export const createStockSchema = (products: Product[], warehouses: Warehouse[], id?: string) => {
    return {
        type: "object",
        properties: {
            id: { type: "string", title: "ID", default: id },
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
            warehouseId: {
                type: ["string", "null"],
                title: "Warehouse",
                oneOf: withNullSelectOption(
                    _(warehouses)
                        .map((warehouse) => ({ const: warehouse.id, title: warehouse.name }))
                        .sortBy("title")
                        .value()
                ),
            },
            quantity: { type: "number", title: "Quantity" },
        },
        required: ["productId", "warehouseId", "quantity"],
    };
};