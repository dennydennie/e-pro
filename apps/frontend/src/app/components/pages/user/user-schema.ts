export const userSchema = {
    type: "object",
    properties: {
        id: { type: "string", title: "ID", default: '' },
        name: { type: "string", title: "Name" },
        email: { type: "string", title: "Email", format: "email" },
        phoneNumber: { type: "string", title: "Phone Number" },
        role: { type: "string", title: "Role", enum: ["admin", "manager", "user"] },
        address: { type: "string", title: "Address" },
        department: { type: "string", title: "Department" },
    },
    required: ["name", "email", "phoneNumber", "role", "address", "department"],
};