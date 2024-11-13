/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { RawMaterialEntity } from '../db/entity/raw-material.entity';
import { RawMaterialRepository } from 'src/db/repository/raw-material.repository';

@Injectable()
export class RawMaterialService {
  constructor(private rawMaterialRepository: RawMaterialRepository) {}

  async create(
    createRawMaterialDto: CreateRawMaterialDto,
  ): Promise<RawMaterialEntity> {
    const rawMaterial = this.rawMaterialRepository.create(createRawMaterialDto);
    return await this.rawMaterialRepository.save(rawMaterial);
  }

  async findAll(): Promise<RawMaterialEntity[]> {
    return await this.rawMaterialRepository.find({
      relations: ['prices'],
    });
  }

  async findOne(id: string): Promise<RawMaterialEntity> {
    const rawMaterial = await this.rawMaterialRepository.findOne({
      where: { id },
      relations: ['prices'],
    });

    if (!rawMaterial) {
      throw new NotFoundException(`Raw material with ID ${id} not found`);
    }

    return rawMaterial;
  }

  async update(
    id: string,
    updateRawMaterialDto: UpdateRawMaterialDto,
  ): Promise<RawMaterialEntity> {
    const rawMaterial = await this.findOne(id);

    Object.assign(rawMaterial, updateRawMaterialDto);
    return await this.rawMaterialRepository.save(rawMaterial);
  }

  async remove(id: string): Promise<void> {
    const result = await this.rawMaterialRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Raw material with ID ${id} not found`);
    }
  }
}
