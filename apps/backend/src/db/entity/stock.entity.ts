/* eslint-disable prettier/prettier */
import { Entity, Column, Unique } from 'typeorm';
import AbstractEntity from './abstract.entity';

@Entity({ name: 'stock' })
@Unique("UQ_product_warehouse", ["productId", "warehouseId"])
export class StockEntity extends AbstractEntity {
  @Column({ nullable : true})
  warehouseId: string;

  @Column({ nullable : true})
  productId: string;

  @Column()
  quantity: number;
}