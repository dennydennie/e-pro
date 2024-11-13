/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierEntity } from '../db/entity/supplier.entity';
import { SupplierRepository } from 'src/db/repository/supplier.repository';

@Injectable()
export class SupplierService {
  constructor(
    private supplierRepository: SupplierRepository,
  ) {}
  async create(createSupplierDto: CreateSupplierDto): Promise<SupplierEntity> {
    const supplier = this.supplierRepository.create({
      ...createSupplierDto,
    });
    return await this.supplierRepository.save(supplier);
  }

  async findAll(): Promise<SupplierEntity[]> {
    return await this.supplierRepository.find({
      relations: ['reviews', 'prices'],
    });
  }

  async findOne(id: string): Promise<SupplierEntity> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: ['reviews', 'prices'],
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<SupplierEntity> {
    const supplier = await this.findOne(id);

    Object.assign(supplier, updateSupplierDto);

    return await this.supplierRepository.save(supplier);
  }

  async remove(id: string): Promise<void> {
    const result = await this.supplierRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
  }
}
