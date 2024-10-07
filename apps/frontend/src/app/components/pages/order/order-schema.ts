export const orderSchema = {
    type: "object",
    properties: {
        id: { type: "string", title: "ID", default: '' },
        customerId: { type: "string", title: "Customer ID" },
        orderDate: { type: "string", title: "Order Date", format: "date" },
        expectedDeliveryDate: { type: "string", title: "Expected Delivery Date", format: "date" },
        notes: { type: "string", title: "Notes" },
        nature: { 
            type: "string", 
            title: "Nature of Order", 
            enum: ["political", "commercial", "personal", "other"] 
        },
        status: { 
            type: "string", 
            title: "Order Status", 
            enum: ["pending", "completed", "canceled"] 
        },
    },
    required: ["customerId", "orderDate", "expectedDeliveryDate", "nature", "status"],
};