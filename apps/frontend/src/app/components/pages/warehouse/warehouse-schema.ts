export const warehouseSchema = {
    type: "object",
    properties: {
        id: { type: "string", title: "ID", default: '' },
        factoryId: { type: "string", title: "Factory ID" },
        name: { type: "string", title: "Warehouse Name" },
        address: { type: "string", title: "Address" },
        latitude: { type: "number", title: "Latitude" },
        longitude: { type: "number", title: "Longitude" },
        phoneNumber: { type: "string", title: "Phone Number" },
        maxCapacity: { type: "number", title: "Max Capacity" },
    },
    required: ["factoryId", "name", "address", "latitude", "longitude", "phoneNumber", "maxCapacity"],
};