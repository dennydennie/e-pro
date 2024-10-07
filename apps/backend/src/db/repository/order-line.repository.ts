/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { OrderLineEntity } from '../entity/order-line.entity';

@Injectable()
export class OrderLineRepository extends Repository<OrderLineEntity> {
  constructor(
    dataSource: DataSource,
  ) {
    super(OrderLineEntity, dataSource.createEntityManager());
  }
}
