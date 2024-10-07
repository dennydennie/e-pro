export const orderLineSchema = {
    type: "object",
    properties: {
        id: { type: "string", title: "ID", default: '' },
        orderId: { type: "string", title: "Order ID" },
        productId: { type: "string", title: "Product ID" },
        quantity: { type: "number", title: "Quantity" },
    },
    required: ["orderId", "productId", "quantity"],
};