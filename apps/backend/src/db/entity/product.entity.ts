/* eslint-disable prettier/prettier */
import { Entity, Column, OneToMany } from 'typeorm';
import { OrderLineEntity } from './order-line.entity';
import { StockEntity } from './stock.entity';
import AbstractEntity from './abstract.entity';

@Entity({ name: 'product' })
export class ProductEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column()
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  mass: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  volume: number;

  @Column()
  dimensions: string;

  @OneToMany(
    () => OrderLineEntity,
    (orderLine: OrderLineEntity) => orderLine.productId,
  )
  orderLines: OrderLineEntity[];

  @OneToMany(() => StockEntity, (stock: StockEntity) => stock.product)
  stocks: StockEntity[];
}