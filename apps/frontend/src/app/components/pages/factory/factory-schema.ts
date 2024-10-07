export const factorySchema = {
    type: "object",
    properties: {
        id: { type: "string", title: "ID", default: '' },
        name: { type: "string", title: "Factory Name" },
        address: { type: "string", title: "Address" },
        latitude: { type: "number", title: "Latitude" },
        longitude: { type: "number", title: "Longitude" },
        userId: { type: "string", title: "User ID" },
        phoneNumber: { type: "string", title: "Phone Number" },
    },
    required: ["name", "address", "latitude", "longitude", "userId", "phoneNumber"],
};