/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { FactoryEntity } from '../entity/factory.entity';

@Injectable()
export class FactoryRepository extends Repository<FactoryEntity> {
  constructor(dataSource: DataSource) {
    super(FactoryEntity, dataSource.createEntityManager());
  }
}
