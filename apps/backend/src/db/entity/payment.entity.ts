/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { CustomerEntity } from './customer.entity';
import { OrderEntity } from './order.entity';

export enum CurrencyEnum {
    USD = 'USD',
    ZiG = 'ZiG',
}

export enum PaymentStatusEnum {
    FAILED = 'Failed',
    SUCCESS = 'Success',
    PENDING = 'Pending',
}


export enum PaymentMethodEnum {
    CASH = "Cash",
    TRANSFER = "Transfer",
}

@Entity({ name: 'payment' })
export default class PaymentEntity extends AbstractEntity {
    @Column()
    amount: number;

    @ManyToOne(() => CustomerEntity, (customer: CustomerEntity) => customer.id, {
        eager: true,
    })
    @JoinColumn()
    customer: CustomerEntity;

    @ManyToOne(() => OrderEntity, (order: OrderEntity) => order.id, {
        eager: true,
    })
    order: OrderEntity;

    @Column({ type: 'enum', enum: CurrencyEnum })
    currency: CurrencyEnum;

    @Column({ type: 'enum', enum: PaymentStatusEnum })
    status: PaymentStatusEnum;

    @Column({ type: 'enum', enum: PaymentMethodEnum })
    method: PaymentMethodEnum;
}
