/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { OrderEntity } from '../entity/order.entity';

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  constructor(dataSource: DataSource) {
    super(OrderEntity, dataSource.createEntityManager());
  }
}
