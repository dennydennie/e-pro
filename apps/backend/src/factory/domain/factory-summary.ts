/* eslint-disable prettier/prettier */
import { FactoryEntity } from "src/db/entity/factory.entity";

export class FactorySummary {
    readonly name: string;
    readonly address: string;
    readonly latitude: number;
    readonly longitude: number;
    readonly userId?: string;

    static fromEntity(entity: FactoryEntity): FactorySummary {
        return {
            name: entity.name,
            address: entity.address,
            latitude: entity.latitude,
            longitude: entity.longitude,
            userId: entity?.manager.id,
        };
    }
}