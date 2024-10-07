/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { StockRepository } from 'src/db/repository/stock.repository';
import { StockEntity } from 'src/db/entity/stock.entity';
import { ProductRepository } from 'src/db/repository/product.repository';
import { WarehouseRepository } from 'src/db/repository/warehouse.repository';
import { IsNull, Not } from 'typeorm';
import { StockSummary } from './domain/stock-summary';

@Injectable()
export class StockService {
  constructor(
    private stockRepository: StockRepository,
    private productRepository: ProductRepository,
    private warehouseRepository: WarehouseRepository,
  ) { }

  async create(createStockDto: CreateStockDto): Promise<StockEntity> {
    const { productId, warehouseId } = createStockDto;

    const existingStock = await this.stockRepository.findOne({
      where: {
        productId,
        warehouseId,
      },
    });

    if (existingStock) {
      throw new BadRequestException('A stock record already exists for this product in the warehouse.');
    }

    const product = await this.productRepository.findOneBy({
      deleted: IsNull(),
      id: productId,
    });

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    const warehouse = await this.warehouseRepository.findOneBy({
      deleted: IsNull(),
      id: warehouseId,
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse does not exist');
    }

    const newStock = this.stockRepository.create(createStockDto);
    newStock.productId = product.id;
    newStock.warehouseId = warehouse.id;

    return await this.stockRepository.save(newStock);
  }

  async findAll(): Promise<StockEntity[]> {
    return await this.stockRepository.find();
  }

  async findAllStocksInWarehouse(warehouseId: string): Promise<StockSummary[]> {
    const warehouse = await this.warehouseRepository.findOneBy({
      id: warehouseId,
      deleted: IsNull(),
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found.');
    }

    const stocks = await this.stockRepository.find({
      where: { warehouseId },
    });

    const summaries = stocks.map(async (stock: StockEntity) => {
      const product = await this.productRepository.findOneBy({
        deleted: IsNull(),
        id: stock.productId
      })

      return {
        id: product.id,
        quantity: stocks.reduce((total, stock) => {
          return total + stock.quantity;
        }, 0),
        name: product.name,
        description: product.description,
        price: product.price,
        mass: product?.mass,
        volume: product.volume,
        dimensions: product.dimensions
      }
    });

    return Promise.all(summaries);
  }

  async findProductStockInAllWarehouses(productId: string): Promise<StockSummary> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
        deleted: IsNull(),
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    const stocks = await this.stockRepository.find({
      where: {
        productId: productId,
        deleted: IsNull(),
      },
    });

    const summary = {
      id: productId,
      quantity: stocks.reduce((total, stock) => {
        return total + stock.quantity;
      }, 0),
      name: product.name,
      description: product.description,
      price: product.price,
      mass: product?.mass,
      volume: product.volume,
      dimensions: product.dimensions
    };

    return summary;
  }

  async findProductStockInWarehouse(warehouseId: string, productId: string): Promise<StockSummary> {
    const warehouse = await this.warehouseRepository.findOneBy({
      id: warehouseId,
      deleted: IsNull(),
    });

    console.log(warehouseId, warehouse);

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found.');
    }

    const stock = await this.stockRepository.findOneBy({
      warehouseId: warehouseId,
      productId: productId,
      deleted: IsNull(),
    });

    if (!stock) {
      throw new NotFoundException('Product not found in the specified warehouse.');
    }

    const product = await this.productRepository.findOneBy({
      id: productId,
      deleted: IsNull(),
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return {
      id: product.id,
      quantity: stock.quantity,
      name: product.name,
      description: product.description,
      price: product.price,
      mass: product.mass,
      volume: product.volume,
      dimensions: product.dimensions,
    };
  }

  async findOne(id: string): Promise<StockEntity> {
    const stock = await this.stockRepository.findOne({ where: { id } });
    if (!stock) {
      throw new NotFoundException(`Stock entry with ID ${id} not found`);
    }
    return stock;
  }

  async update(stockId: string, updateStockDto: UpdateStockDto): Promise<StockEntity> {
    const { productId, warehouseId, quantity } = updateStockDto;

    const existingStock = await this.stockRepository.findOneOrFail({
      where: { id: stockId },
    });

    if (productId || warehouseId) {
      const anotherExistingStock = await this.stockRepository.findOne({
        where: {
          productId: productId || existingStock.productId,
          warehouseId: warehouseId || existingStock.warehouseId,
          id: Not(stockId),
        },
      });

      if (anotherExistingStock) {
        throw new BadRequestException('A stock record already exists for this product in the warehouse.');
      }
    }

    if (productId) {
      const product = await this.productRepository.findOneBy({
        deleted: IsNull(),
        id: productId,
      });

      if (!product) {
        throw new NotFoundException('Product does not exist.');
      }

      existingStock.productId = product.id;
    }

    if (warehouseId) {
      const warehouse = await this.warehouseRepository.findOneBy({
        deleted: IsNull(),
        id: warehouseId,
      });

      if (!warehouse) {
        throw new NotFoundException('Warehouse does not exist.');
      }

      existingStock.warehouseId = warehouse.id;
    }

    if (typeof quantity !== 'undefined') {
      existingStock.quantity = quantity;
    }

    return await this.stockRepository.save(existingStock);
  }

  async remove(id: string): Promise<void> {
    const stock = await this.findOne(id);
    await this.stockRepository.remove(stock);
  }
}
