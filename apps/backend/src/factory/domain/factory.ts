/* eslint-disable prettier/prettier */
import { User } from "src/auth/domain/user";
import { FactoryEntity } from "src/db/entity/factory.entity";

export class Factory {
    readonly name?: string;
    readonly address?: string;
    readonly latitude?: number;
    readonly longitude?: number;
    readonly manager?: User;

    static fromEntity(entity: FactoryEntity): Factory {
        return {
            name: entity?.name,
            address: entity?.address,
            latitude: entity?.latitude,
            longitude: entity?.longitude,
            manager: User?.fromEntity(entity?.manager),
        };
    }
}