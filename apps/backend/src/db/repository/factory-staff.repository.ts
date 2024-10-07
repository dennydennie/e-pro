/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { FactoryStaffEntity } from '../entity/factory-staff.entity';

@Injectable()
export class FactoryStaffRepository extends Repository<FactoryStaffEntity> {
  constructor(dataSource: DataSource) {
    super(FactoryStaffEntity, dataSource.createEntityManager());
  }
}