/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockThresholdDto } from './dto/create-stock-threshold.dto';
import { UpdateStockThresholdDto } from './dto/update-stock-threshold.dto';
import { StockThresholdRepository } from 'src/db/repository/stock-threshold.repository';
import { StockThresholdEntity } from 'src/db/entity/stock-thershold.entity';

@Injectable()
export class StockThresholdService {
  constructor(
    private stockThresholdRepository: StockThresholdRepository,
  ) {}

  async create(
    createStockThresholdDto: CreateStockThresholdDto,
  ): Promise<StockThresholdEntity> {
    const stockThreshold = this.stockThresholdRepository.create(
      createStockThresholdDto,
    );
    return await this.stockThresholdRepository.save(stockThreshold);
  }

  async findAll(): Promise<StockThresholdEntity[]> {
    return await this.stockThresholdRepository.find();
  }

  async findOne(id: string): Promise<StockThresholdEntity> {
    const stockThreshold = await this.stockThresholdRepository.findOne({
      where: { id },
    });
    if (!stockThreshold) {
      throw new NotFoundException(`Stock threshold with ID ${id} not found`);
    }
    return stockThreshold;
  }

  async update(
    id: string,
    updateStockThresholdDto: UpdateStockThresholdDto,
  ): Promise<StockThresholdEntity> {
    const stockThreshold = await this.findOne(id);
    this.stockThresholdRepository.merge(
      stockThreshold,
      updateStockThresholdDto,
    );
    return await this.stockThresholdRepository.save(stockThreshold);
  }

  async remove(id: string): Promise<void> {
    const stockThreshold = await this.findOne(id);
    await this.stockThresholdRepository.remove(stockThreshold);
  }
}
