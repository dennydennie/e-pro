import { User } from "@/app/types/user";
import { Factory } from "@/app/types/factory";
import { withNullSelectOption } from "@/app/utils/with-null-select";
import _ from "lodash";

export const createFactoryStaffSchema = (users: User[], factories: Factory[], id?: string) => {
    return {
        type: "object",
        properties: {
            id: { type: "string", title: "ID", default: id },
            userId: {
                type: ["string", "null"],
                title: "User",
                oneOf: withNullSelectOption(
                    _(users)
                        .map((user) => ({ const: user.id, title: user.name }))
                        .sortBy("title")
                        .value()
                ),
            },
            factoryId: {
                type: ["string", "null"],
                title: "Factory",
                oneOf: withNullSelectOption(
                    _(factories)
                        .map((factory) => ({ const: factory.id, title: factory.name }))
                        .sortBy("title")
                        .value()
                ),
            },
            jobTitle: { type: "string", title: "Job Title" },
            department: { type: "string", title: "Department" },
        },
        required: ["userId", "factoryId", "jobTitle", "department"],
    };
};