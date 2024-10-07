/* eslint-disable prettier/prettier */
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { OrderLineEntity } from './order-line.entity';
import { CustomerEntity } from './customer.entity';
import AbstractEntity from './abstract.entity';

@Entity({ name: 'order' })
export class OrderEntity extends AbstractEntity {
    @Column()
    orderDate: Date;

    @Column()
    expectedDeliveryDate: Date;

    @ManyToOne(() => CustomerEntity, (customer: CustomerEntity) => customer.orders, { eager: true })
    customer: CustomerEntity;

    @OneToMany(() => OrderLineEntity, (orderLine: OrderLineEntity) => orderLine.order, { eager: true })
    orderLines: OrderLineEntity[];

    @Column({ nullable: true })
    notes?: string;

    @Column()
    nature: string;

    @Column()
    status: string;
}