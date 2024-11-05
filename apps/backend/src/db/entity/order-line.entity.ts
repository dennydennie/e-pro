/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'order_line' })
export class OrderLineEntity extends AbstractEntity {
    @ManyToOne(() => OrderEntity, (order: OrderEntity) => order.orderLines)
    @JoinColumn()
    order: OrderEntity;

    @Column({ nullable: true })
    orderId: string;

    @ManyToOne(() => ProductEntity, (product: ProductEntity) => product.id, { eager: true })
    @JoinColumn()
    product: ProductEntity;

    @Column({ nullable: true })
    productId: string;

    @Column()
    quantity: number;
}