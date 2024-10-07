/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { StockThresholdEntity } from '../entity/stock-thershold.entity';

@Injectable()
export class StockThresholdRepository extends Repository<StockThresholdEntity> {
    constructor(dataSource: DataSource) {
        super(StockThresholdEntity, dataSource.createEntityManager());
    }
}