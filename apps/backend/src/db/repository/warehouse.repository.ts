/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { WarehouseEntity } from '../entity/warehouse.entity';

@Injectable()
export class WarehouseRepository extends Repository<WarehouseEntity> {
  constructor(
    dataSource: DataSource,
  ) {
    super(WarehouseEntity, dataSource.createEntityManager());
  }
}
