/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import { FactoryRepository } from 'src/db/repository/factory.repository';
import { FactoryEntity } from 'src/db/entity/factory.entity';
import { UserRepository } from 'src/db/repository/user.repository';
import { IsNull } from 'typeorm';
import { FactorySummary } from './domain/factory-summary';

@Injectable()
export class FactoryService {
  constructor(
    private factoryRepository: FactoryRepository,
    private readonly userRepository: UserRepository,
  ) { }

  async create(createFactoryDto: CreateFactoryDto): Promise<FactoryEntity> {
    const user = await this.userRepository.findOneBy({
      deleted: IsNull(),
      id: createFactoryDto.userId
    });

    if (!user) {
      throw new NotFoundException('User does not exist')
    }
    const factory = this.factoryRepository.create(createFactoryDto);
    factory.manager = user;
    return await this.factoryRepository.save(factory);
  }

  async findAll(): Promise<FactoryEntity[]> {
    return await this.factoryRepository.find();
  }

  async findOne(id: string): Promise<FactorySummary> {
    const factory = await this.factoryRepository.findOne({ where: { id } });
    if (!factory) {
      throw new NotFoundException(`Factory with ID ${id} not found`);
    }
    return FactorySummary.fromEntity(factory);
  }

  async update(
    id: string,
    updateFactoryDto: UpdateFactoryDto,
  ): Promise<FactoryEntity> {
    const factory = await this.factoryRepository.findOne({ where: { id } });
    if (!factory) {
      throw new NotFoundException(`Factory with ID ${id} not found`);
    }
    this.factoryRepository.merge(factory, updateFactoryDto);
    return await this.factoryRepository.save(factory);
  }

  async remove(id: string): Promise<void> {
    const factory = await this.factoryRepository.findOne({ where: { id } });
    if (!factory) {
      throw new NotFoundException(`Factory with ID ${id} not found`);
    }
    await this.factoryRepository.remove(factory);
  }
}
