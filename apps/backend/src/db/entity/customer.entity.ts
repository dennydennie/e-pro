/* eslint-disable prettier/prettier */
import { Entity, Column, OneToMany } from 'typeorm';
import { OrderEntity } from './order.entity';
import AbstractEntity from './abstract.entity';

@Entity({ name: 'customer' })
export class CustomerEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  contactPerson: string;

  @Column()
  contactPersonMobile: string;

  @Column()
  shippingAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  shippingLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  shippingLongitude: number;

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.customer)
  orders: OrderEntity[];
}
