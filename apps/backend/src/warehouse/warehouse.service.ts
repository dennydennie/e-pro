/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseRepository } from 'src/db/repository/warehouse.repository';
import { WarehouseEntity } from 'src/db/entity/warehouse.entity';
import { FactoryRepository } from 'src/db/repository/factory.repository';
import { IsNull } from 'typeorm';

@Injectable()
export class WarehouseService {
  constructor(
    private warehouseRepository: WarehouseRepository,
    private factoryRepository: FactoryRepository,
  ) { }

  async create(createWarehouseDto: CreateWarehouseDto): Promise<WarehouseEntity> {
    const factory = await this.factoryRepository.findOneBy({
      deleted: IsNull(),
      id: createWarehouseDto.factoryId
    });

    const warehouse = this.warehouseRepository.create(createWarehouseDto);
    warehouse.factory = factory;

    return await this.warehouseRepository.save(warehouse);
  }

  async findAll(): Promise<WarehouseEntity[]> {
    return await this.warehouseRepository.find();
  }

  async findOne(id: string): Promise<WarehouseEntity> {
    const warehouse = await this.warehouseRepository.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto): Promise<WarehouseEntity> {
    const warehouse = await this.findOne(id);
    this.warehouseRepository.merge(warehouse, updateWarehouseDto);
    return await this.warehouseRepository.save(warehouse);
  }

  async remove(id: string): Promise<void> {
    const warehouse = await this.findOne(id);
    await this.warehouseRepository.remove(warehouse);
  }
}