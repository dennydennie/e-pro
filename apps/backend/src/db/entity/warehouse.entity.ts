/* eslint-disable prettier/prettier */
import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { FactoryEntity } from './factory.entity';
import { StockThresholdEntity } from './stock-thershold.entity';
import { StockEntity } from './stock.entity';
import AbstractEntity from './abstract.entity';

@Entity({ name: 'warehouse' })
export class WarehouseEntity extends AbstractEntity {
    @Column()
    name: string;

    @ManyToOne(() => FactoryEntity, (factory: FactoryEntity) => factory.warehouses, { eager: true })
    @JoinColumn({ name: 'factoryId' })
    factory: FactoryEntity;

    @OneToMany(() => StockThresholdEntity, (stockThreshold: StockThresholdEntity) => stockThreshold.warehouse)
    stockThresholds: StockThresholdEntity[];

    @OneToMany(() => StockEntity, (stock: StockEntity) => stock.warehouseId)
    stocks: StockEntity[];

    @Column({ type: 'decimal', precision: 10, scale: 8 })
    latitude: number;

    @Column({ type: 'decimal', precision: 11, scale: 8 })
    longitude: number;

    @Column()
    address: string;

    @Column({ default: 0 })
    maxCapacity: number;

    @Column({ name: 'factoryId', nullable: true })
    factoryId: string;
}
