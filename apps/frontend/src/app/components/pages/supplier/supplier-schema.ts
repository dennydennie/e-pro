export const supplierSchema = {
    type: "object",
    properties: {
        id: { type: "string", title: "ID", default: '' },
        name: { type: "string", title: "Name", minLength: 1, maxLength: 40 },
        address: { type: "string", title: "Address", minLength: 1, maxLength: 100 },
        lat: { 
            type: "number", 
            title: "Latitude", 
            minimum: -90, 
            maximum: 90 
        },
        lon: { 
            type: "number", 
            title: "Longitude", 
            minimum: -180, 
            maximum: 180 
        },
        contactNumber: { type: "string", title: "Contact Number", minLength: 1, maxLength: 40 },
        taxClearance: { 
            type: "string", 
            title: "Tax Clearance Document", 
            format: "data-url" 
        },
        taxExpiry: { 
            type: "string", 
            title: "Tax Expiry Date", 
            format: "date" 
        },
        prazNumber: { type: "string", title: "PRAZ Number", minLength: 1 },
        vatNumber: { type: "string", title: "VAT Number", minLength: 1 }
    },
    required: ["name", "address", "lat", "lon", "contactNumber", "taxClearance", "taxExpiry", "prazNumber", "vatNumber"]
};