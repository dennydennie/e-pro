/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFactoryStaffDto } from './dto/create-factory-staff.dto';
import { UpdateFactoryStaffDto } from './dto/update-factory-staff.dto';
import { FactoryStaffRepository } from 'src/db/repository/factory-staff.repository';
import { FactoryStaffEntity } from 'src/db/entity/factory-staff.entity';

@Injectable()
export class FactoryStaffService {
  constructor(
    private factoryStaffRepository: FactoryStaffRepository,
  ) {}

  async create(createFactoryStaffDto: CreateFactoryStaffDto): Promise<FactoryStaffEntity> {
    const factoryStaff = this.factoryStaffRepository.create(createFactoryStaffDto);
    return await this.factoryStaffRepository.save(factoryStaff);
  }

  async findAll(): Promise<FactoryStaffEntity[]> {
    return await this.factoryStaffRepository.find();
  }

  async findOne(id: string): Promise<FactoryStaffEntity> {
    const factoryStaff = await this.factoryStaffRepository.findOne({ where: { id } });
    if (!factoryStaff) {
      throw new NotFoundException(`Factory staff member with ID ${id} not found`);
    }
    return factoryStaff;
  }

  async update(id: string, updateFactoryStaffDto: UpdateFactoryStaffDto): Promise<FactoryStaffEntity> {
    const factoryStaff = await this.findOne(id);
    this.factoryStaffRepository.merge(factoryStaff, updateFactoryStaffDto);
    return await this.factoryStaffRepository.save(factoryStaff);
  }

  async remove(id: string): Promise<void> {
    const factoryStaff = await this.findOne(id);
    await this.factoryStaffRepository.remove(factoryStaff);
  }
}