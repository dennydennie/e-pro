import { withNullSelectOption } from "@/app/utils/with-null-select";
import _ from "lodash";
import { Supplier } from "../supplier/SupplierListComponent";
import { RawMaterial } from "../raw-material/RawMaterialListComponent";


export const createPriceFormSchema = (suppliers: Supplier[], rawMaterials: RawMaterial[], id?: string) => {
    return {
        type: "object",
        properties: {
            id: { type: "string", title: "ID", default: id },
            supplierId: {
                title: "Supplier",
                type: ["string", "null"],
                oneOf: withNullSelectOption(
                    _(suppliers)
                        .map((supplier) => ({ const: supplier.id, title: supplier.name }))
                        .sortBy("title")
                        .value()
                ),
            },
            rawMaterialId: {
                title: "Raw Material",
                type: ["string", "null"],
                oneOf: withNullSelectOption(
                    _(rawMaterials)
                        .map((material) => ({ const: material.id, title: material.name }))
                        .sortBy("title")
                        .value()
                ),
            },
            price: {
                type: "number",
                title: "Price",
                minimum: 0
            }
        },
        required: ["price", "supplierId", "rawMaterialId"]
    };
};