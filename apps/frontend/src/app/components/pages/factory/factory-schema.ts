import { User } from "@/app/types/user";
import { withNullSelectOption } from "@/app/utils/with-null-select";
import _ from "lodash";

export const createFactorySchema = (users: User[], id?: string) => {
    return {
        type: "object",
        properties: {
            id: { type: "string", title: "ID", default: id },
            name: { type: "string", title: "Factory Name" },
            address: { type: "string", title: "Address" },
            latitude: { type: "string", title: "Latitude" },
            longitude: { type: "string", title: "Longitude" },
            userId: {
                title: "Manager",
                type: ["string", "null"],
                oneOf: withNullSelectOption(
                    _(users)
                        .map((it) => ({ const: it.id, title: it.name }))
                        .sortBy("title")
                        .value()
                ),
            },
            phoneNumber: { type: "string", title: "Phone Number" },
        },
        required: ["name", "address", "latitude", "longitude", "userId", "phoneNumber"],
    };
};