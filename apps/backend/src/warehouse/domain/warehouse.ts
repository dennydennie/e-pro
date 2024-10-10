/* eslint-disable prettier/prettier */
import { WarehouseEntity } from 'src/db/entity/warehouse.entity';
import { Factory } from 'src/factory/domain/factory';
export class Warehouse {
    readonly factory: Factory;
    readonly name: string;
    readonly address: string;
    readonly latitude: number;
    readonly longitude: number;
    readonly maxCapacity: number;

    static fromEntity(entity: WarehouseEntity): Warehouse {
        return {
            factory: Factory.fromEntity(entity.factory),
            name: entity.name,
            address: entity.address,
            latitude: entity.latitude,
            longitude: entity.longitude,
            maxCapacity: entity.maxCapacity,
        };
    }
}
