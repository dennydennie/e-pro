/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFactoryStaffDto } from './dto/create-factory-staff.dto';
import { UpdateFactoryStaffDto } from './dto/update-factory-staff.dto';
import { FactoryStaffRepository } from 'src/db/repository/factory-staff.repository';
import { FactoryStaffEntity } from 'src/db/entity/factory-staff.entity';
import { FactoryStaffSummary } from './domain/factory-staff-summary';
import { FactoryStaff } from './domain/factory';
import { IsNull } from 'typeorm';

@Injectable()
export class FactoryStaffService {
  constructor(
    private factoryStaffRepository: FactoryStaffRepository,
  ) { }

  async create(createFactoryStaffDto: CreateFactoryStaffDto): Promise<FactoryStaffEntity> {
    const factoryStaff = this.factoryStaffRepository.create(createFactoryStaffDto);
    return await this.factoryStaffRepository.save(factoryStaff);
  }

  async findAll(): Promise<FactoryStaff[]> {
    const allStaff = await this.factoryStaffRepository.findBy({
      deleted: IsNull(),
    });
    return allStaff.map((staff) => FactoryStaff.fromEntity(staff));
  }

  async findOne(id: string): Promise<FactoryStaffSummary> {
    const factoryStaff = await this.factoryStaffRepository.findOne({ where: { id } });
    if (!factoryStaff) {
      throw new NotFoundException(`Factory staff member with ID ${id} not found`);
    }
    return FactoryStaffSummary.fromEntity(factoryStaff);
  }

  async update(id: string, updateFactoryStaffDto: UpdateFactoryStaffDto): Promise<FactoryStaffEntity> {
    const factoryStaff = await this.factoryStaffRepository.findOne({ where: { id } });
    if (!factoryStaff) {
      throw new NotFoundException(`Factory staff member with ID ${id} not found`);
    }
    this.factoryStaffRepository.merge(factoryStaff, updateFactoryStaffDto);
    return await this.factoryStaffRepository.save(factoryStaff);
  }

  async remove(id: string): Promise<void> {
    const factoryStaff = await this.factoryStaffRepository.findOne({ where: { id } });
    if (!factoryStaff) {
      throw new NotFoundException(`Factory staff member with ID ${id} not found`);
    }
    await this.factoryStaffRepository.remove(factoryStaff);
  }
}