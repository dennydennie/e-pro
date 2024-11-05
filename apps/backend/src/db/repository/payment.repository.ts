/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import PaymentEntity from '../entity/payment.entity';

@Injectable()
export class PaymentRepository extends Repository<PaymentEntity> {
    constructor(dataSource: DataSource) {
        super(PaymentEntity, dataSource.createEntityManager());
    }
}