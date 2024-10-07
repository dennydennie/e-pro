/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerEntity } from '../entity/customer.entity';

@Injectable()
export class CustomerRepository extends Repository<CustomerEntity> {
    constructor(dataSource: DataSource) {
        super(CustomerEntity, dataSource.createEntityManager());
    }
}