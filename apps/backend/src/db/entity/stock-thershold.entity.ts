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
  )
  @JoinColumn()
  warehouse: WarehouseEntity;

  @ManyToOne(() => ProductEntity, (product: ProductEntity) => product.orderLines)
  @JoinColumn()
  product: ProductEntity;

  @Column()
  lowStockThreshold: number;

  @Column()
  highStockThreshold: number;
}
