/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { PriceRepository } from '../db/repository/price.repository';
import { PriceEntity } from '../db/entity/price.entity';

@Injectable()
export class PriceService {
  constructor(private priceRepository: PriceRepository) {}

  async create(createPriceDto: CreatePriceDto): Promise<PriceEntity> {
    const price = this.priceRepository.create({
      price: createPriceDto.price,
      supplier: { id: createPriceDto.supplierId },
      rawMaterial: { id: createPriceDto.rawMaterialId },
    });

    return await this.priceRepository.save(price);
  }

  async findAll(): Promise<PriceEntity[]> {
    return await this.priceRepository.find({
      relations: ['supplier', 'rawMaterial'],
    });
  }

  async findOne(id: string): Promise<PriceEntity> {
    const price = await this.priceRepository.findOne({
      where: { id },
      relations: ['supplier', 'rawMaterial'],
    });

    if (!price) {
      throw new NotFoundException(`Price with ID ${id} not found`);
    }

    return price;
  }

  async update(id: string, updatePriceDto: UpdatePriceDto): Promise<PriceEntity> {
    const price = await this.priceRepository.findOne({
      where: { id },
    });

    if (!price) {
      throw new NotFoundException(`Price with ID ${id} not found`);
    }

    if (updatePriceDto.price !== undefined) {
      price.price = updatePriceDto.price;
    }
    if (updatePriceDto.supplierId) {
      price.supplier = { id: updatePriceDto.supplierId } as any;
    }
    if (updatePriceDto.rawMaterialId) {
      price.rawMaterial = { id: updatePriceDto.rawMaterialId } as any;
    }

    return await this.priceRepository.save(price);
  }

  async remove(id: string): Promise<void> {
    const result = await this.priceRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Price with ID ${id} not found`);
    }
  }
}
