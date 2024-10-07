/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_line' })
export class OrderLineEntity extends AbstractEntity {
    @ManyToOne(() => OrderEntity, (order: OrderEntity) => order.orderLines)
    @JoinColumn()
    order: OrderEntity;

    @Column({ nullable: true })
    orderId: string;

    @Column({ nullable: true })
    productId: string;

    @Column()
    quantity: number;
}