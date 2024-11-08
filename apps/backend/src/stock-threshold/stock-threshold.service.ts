/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockThresholdDto } from './dto/create-stock-threshold.dto';
import { UpdateStockThresholdDto } from './dto/update-stock-threshold.dto';
import { StockThresholdRepository } from 'src/db/repository/stock-threshold.repository';
import { StockThresholdEntity } from 'src/db/entity/stock-thershold.entity';
import { IsNull } from 'typeorm';
import { ProductRepository } from 'src/db/repository/product.repository';
import { WarehouseRepository } from './../db/repository/warehouse.repository';
import { StockThresholdDetail } from './domain/stock-threshold';
import { StockThresholdSummary } from './domain/stock-threshold-summary';

@Injectable()
export class StockThresholdService {
  constructor(
    private stockThresholdRepository: StockThresholdRepository,
    private productRepository: ProductRepository,
    private warehouseRepository: WarehouseRepository,
  ) { }

  async create(
    createStockThresholdDto: CreateStockThresholdDto,
  ): Promise<StockThresholdEntity> {
    const stockThreshold = this.stockThresholdRepository.create(
      createStockThresholdDto,
    );
    return await this.stockThresholdRepository.save(stockThreshold);
  }

  async findAll(): Promise<StockThresholdDetail[]> {
    const thresholds = await this.stockThresholdRepository.findBy({
      deleted: IsNull()
    });

    const ops = thresholds.map(async (threshold: StockThresholdEntity) => {

      const product = await this.productRepository.findOneBy({
        deleted: IsNull(),
        id: threshold.product?.id
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${threshold.product?.id} not found`);
      }

      const warehouse = await this.warehouseRepository.findOneBy({
        deleted: IsNull(),
        id: threshold.warehouse?.id,
      })

      if (!warehouse) {
        throw new NotFoundException(`Warehouse with ID ${threshold.warehouse?.id} not found`);
      }

      return StockThresholdDetail.fromEntity({
        ...threshold,
        product,
        warehouse
      });
    });

    return Promise.all(ops);
  }

  async findOne(id: string): Promise<StockThresholdSummary> {
    const stockThreshold = await this.stockThresholdRepository.findOne({
      where: { id },
    });
    if (!stockThreshold) {
      throw new NotFoundException(`Stock threshold with ID ${id} not found`);
    }
    return StockThresholdSummary.fromEntity(stockThreshold);
  }

  async update(
    id: string,
    updateStockThresholdDto: UpdateStockThresholdDto,
  ): Promise<StockThresholdEntity> {
    const stockThreshold = await this.stockThresholdRepository.findOne({
      where: { id },
    });
    this.stockThresholdRepository.merge(
      stockThreshold,
      updateStockThresholdDto,
    );
    return await this.stockThresholdRepository.save(stockThreshold);
  }

  async remove(id: string): Promise<void> {
    const stockThreshold = await this.stockThresholdRepository.findOne({
      where: { id },
    });
    await this.stockThresholdRepository.remove(stockThreshold);
  }
}
