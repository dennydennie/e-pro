import { Factory } from "@/app/types/factory";
import { withNullSelectOption } from "@/app/utils/with-null-select";
import _ from "lodash";

export const createWarehouseSchema = (factories: Factory[], id?: string) => {
    return {
        type: "object",
        properties: {
            id: { type: "string", title: "ID", default: id },
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
            name: { type: "string", title: "Warehouse Name" },
            address: { type: "string", title: "Address" },
            latitude: { type: "number", title: "Latitude", min: -180, max: 180 },
            longitude: { type: "number", title: "Longitude", min: -180, max: 180 },
            maxCapacity: { type: "number", title: "Max Capacity" },
        },
        required: ["factoryId", "name", "address", "latitude", "longitude", "maxCapacity"],
    };
};