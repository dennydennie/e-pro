/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { StockEntity } from 'src/db/entity/stock.entity';
import { ProductSummaryDto } from './dto/product-summary.dto';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @ApiOperation({
    summary: 'Create a new stock entry',
    description: 'This endpoint allows you to create a new stock entry in the system.',
  })
  @ApiResponse({ status: 201, description: 'The stock entry has been created.' })
  @ApiResponse({ status: 400, description: 'Bad request. Check the input data.' })
  @Post()
  async create(@Body() createStockDto: CreateStockDto) {
    return await this.stockService.create(createStockDto);
  }

  @ApiOperation({
    summary: 'Get all stock entries',
    description: 'This endpoint retrieves all the stock entries in the system.',
  })
  @ApiResponse({ status: 200, description: 'The list of stock entries.' })
  @Get()
  async findAll() {
    return await this.stockService.findAll();
  }

  @ApiOperation({
    summary: 'Get a stock entry by ID',
    description: 'This endpoint retrieves a specific stock entry by its ID.',
  })
  @ApiResponse({ status: 200, description: 'The stock entry data.' })
  @ApiResponse({ status: 404, description: 'Stock entry not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.stockService.findOne(id);
  }

  @Get('product/:productId/warehouses')
  @ApiOperation({ summary: 'Get all stocks of a product in all warehouses' })
  @ApiResponse({ status: 200, description: 'Returns all stock records of the product in all warehouses.', type: StockEntity, isArray: true })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({ name: 'productId', required: true, description: 'ID of the product to fetch its stock.' })
  async getProductStockInAllWarehouses(@Param('productId') productId: string): Promise<ProductSummaryDto> {
    return this.stockService.findProductStockInAllWarehouses(productId);
  }

  @Get('product/:productId/warehouses/:warehouseId')
  @ApiOperation({ summary: 'Get stock of a product in a specific warehouse' })
  @ApiResponse({ status: 200, description: 'Returns the stock record of the product in the specified warehouse.', type: StockEntity })
  @ApiResponse({ status: 404, description: 'Product or warehouse not found.' })
  @ApiParam({ name: 'productId', required: true, description: 'ID of the product to fetch its stock.' })
  @ApiParam({ name: 'warehouseId', required: true, description: 'ID of the warehouse to fetch stock in.' })
  async getProductStockInWarehouse(
    @Param('productId') productId: string,
    @Param('warehouseId') warehouseId: string,
  ): Promise<ProductSummaryDto> {
    return this.stockService.findProductStockInWarehouse(productId, warehouseId);
  }

  @Get('warehouses/:warehouseId')
  @ApiOperation({ summary: 'Get all stocks in a specific warehouse' })
  @ApiResponse({ status: 200, description: 'Returns all stock records in the specified warehouse.', type: StockEntity, isArray: true })
  @ApiResponse({ status: 404, description: 'Warehouse not found.' })
  @ApiParam({ name: 'warehouseId', required: true, description: 'ID of the warehouse to fetch stock records.' })
  async findAllStocksInWarehouse(@Param('warehouseId') warehouseId: string): Promise<ProductSummaryDto[]> {
    return this.stockService.findAllStocksInWarehouse(warehouseId);
  }

  @ApiOperation({
    summary: 'Update a stock entry',
    description: 'This endpoint allows you to update the details of an existing stock entry.',
  })
  @ApiResponse({ status: 200, description: 'The updated stock entry data.' })
  @ApiResponse({ status: 404, description: 'Stock entry not found.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return await this.stockService.update(id, updateStockDto);
  }

  @ApiOperation({
    summary: 'Delete a stock entry',
    description: 'This endpoint allows you to delete a stock entry from the system.',
  })
  @ApiResponse({ status: 200, description: 'The stock entry has been deleted.' })
  @ApiResponse({ status: 404, description: 'Stock entry not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.stockService.remove(id);
  }
}