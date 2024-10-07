export const productSchema = {
    type: "object",
    properties: {
        id: { type: "string", title: "ID", default: '' },
        name: { type: "string", title: "Product Name" },
        description: { type: "string", title: "Description" },
        price: { type: "number", title: "Price" },
        unit: { type: "string", title: "Unit", enum: ["kg", "L"] },
        mass: { type: "number", title: "Mass (optional)" },
        volume: { type: "number", title: "Volume (optional)" },
        dimensions: { type: "string", title: "Dimensions" },
        expiryDate: { type: "string", title: "Expiry Date", format: "date" },
    },
    required: ["name", "description", "price", "unit", "dimensions", "expiryDate"],
};