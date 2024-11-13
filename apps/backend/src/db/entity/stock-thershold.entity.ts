/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { WarehouseEntity } from './warehouse.entity';
import AbstractEntity from './abstract.entity';

@Entity({ name: 'stock_threshold' })
export class StockThresholdEntity extends AbstractEntity {
  @ManyToOne(
    () => WarehouseEntity,
    (warehouse: WarehouseEntity) => warehouse.stockThresholds,
    { eager: true }
  )
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: WarehouseEntity;

  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: string;

  @ManyToOne(() => ProductEntity, (product: ProductEntity) => product.id, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ name: 'product_id', nullable: true })
  productId: string;

  @Column()
  lowStockThreshold: number;

  @Column()
  highStockThreshold: number;
}
