export const factoryStaffSchema = {
    type: "object",
    properties: {
        id: { type: "string", title: "ID", default: '' },
        userId: { type: "string", title: "User ID" },
        factoryId: { type: "string", title: "Factory ID" },
        jobTitle: { type: "string", title: "Job Title" },
        department: { type: "string", title: "Department" },
    },
    required: ["userId", "factoryId", "jobTitle", "department"],
};