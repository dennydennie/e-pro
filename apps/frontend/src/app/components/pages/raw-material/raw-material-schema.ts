export const rawMaterialSchema = {
    type: "object",
    properties: {
        id: { type: "string", title: "ID", default: '' },
        name: { 
            type: "string", 
            title: "Material Name", 
            minLength: 1, 
            maxLength: 100 
        },
        description: { 
            type: "string", 
            title: "Description", 
            minLength: 1,
            maxLength: 500 
        }
    },
    required: ["name", "description"]
};