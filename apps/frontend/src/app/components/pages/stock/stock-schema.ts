export const stockSchema = {
    type: "object",
    properties: {
        id: { type: "string", title: "ID", default: '' },
        productId: { type: "string", title: "Product ID" },
        warehouseId: { type: "string", title: "Warehouse ID" },
        quantity: { type: "number", title: "Quantity" },
    },
    required: ["productId", "warehouseId", "quantity"],
};