export const customerSchema = {
    type: "object",
    properties: {
        id: { type: "string", title: "ID", default: '' },
        name: { type: "string", title: "Name", minLength: 1, maxLenght: 40 },
        email: {
            type: "string",
            title: "Email",
            format: "email",
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            maxLenght: 50
        },
        contactPerson: { type: "string", title: "Contact Person", minLength: 1, maxLenght: 40 },
        contactPersonMobile: { type: "string", title: "Contact Person Mobile", minLength: 1, maxLenght: 40 },
        shippingAddress: { type: "string", title: "Shipping Address", minLength: 1, maxLenght: 40, },
        shippingLatitude: { type: "string", title: "Shipping Latitude", maxLenght: 6, min: -180, max: 180 },
        shippingLongitude: { type: "string", title: "Shipping Longitude", maxLenght: 6, min: -180, max: 180 }
    },
    required: ["name", "email", "contactPerson", "contactPersonMobile", "shippingAddress", "shippingLatitude", "shippingLongitude"]
};