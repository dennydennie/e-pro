/* eslint-disable prettier/prettier */
import { Entity, Column, Unique, ManyToOne } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { ProductEntity } from './product.entity';
import { WarehouseEntity } from './warehouse.entity';

@Entity({ name: 'stock' })
@Unique("UQ_product_warehouse", ["productId", "warehouseId"])
export class StockEntity extends AbstractEntity {
  @ManyToOne(() => WarehouseEntity, (warehouse: WarehouseEntity) => warehouse.stocks, { eager: true, nullable: true })
  warehouse: WarehouseEntity;

  @Column({ nullable: true })
  warehouseId: string;

  @ManyToOne(() => ProductEntity, (product: ProductEntity) => product.stocks, { eager: true, nullable: true })
  product: ProductEntity;

  @Column({ nullable: true })
  productId: string;

  @Column()
  quantity: number;
}