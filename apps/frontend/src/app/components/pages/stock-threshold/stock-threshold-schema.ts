export const stockThresholdSchema = {
    type: "object",
    properties: {
        id: { type: "string", title: "ID", default: '' },
        productId: { type: "string", title: "Product ID" },
        warehouseId: { type: "string", title: "Warehouse ID" },
        lowStockThreshold: { type: "number", title: "Low Stock Threshold" },
        highStockThreshold: { type: "number", title: "High Stock Threshold" },
    },
    required: ["productId", "warehouseId", "lowStockThreshold", "highStockThreshold"],
};