/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { StockEntity } from '../entity/stock.entity';

@Injectable()
export class StockRepository extends Repository<StockEntity> {
  constructor( dataSource: DataSource) {
    super(StockEntity, dataSource.createEntityManager());
  }
}
