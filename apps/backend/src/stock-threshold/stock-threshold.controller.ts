/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockThresholdService } from './stock-threshold.service';
import { CreateStockThresholdDto } from './dto/create-stock-threshold.dto';
import { UpdateStockThresholdDto } from './dto/update-stock-threshold.dto';
import { StockThresholdDetail } from './domain/stock-threshold';
import { StockThresholdSummary } from './domain/stock-threshold-summary';

@ApiTags('Stock Thresholds')
@Controller('stock-threshold')
export class StockThresholdController {
  constructor(private readonly stockThresholdService: StockThresholdService) { }

  @ApiOperation({
    summary: 'Create a new stock threshold',
    description: 'This endpoint allows you to create a new stock threshold in the system.',
  })
  @ApiResponse({ status: 201, description: 'The stock threshold has been created.' })
  @ApiResponse({ status: 400, description: 'Bad request. Check the input data.' })
  @Post()
  async create(@Body() createStockThresholdDto: CreateStockThresholdDto) {
    return await this.stockThresholdService.create(createStockThresholdDto);
  }

  @ApiOperation({
    summary: 'Get all stock thresholds',
    description: 'This endpoint retrieves all the stock thresholds in the system.',
  })
  @ApiResponse({ status: 200, description: 'The list of stock thresholds.' })
  @Get()
  async findAll(): Promise<StockThresholdDetail[]> {
    return await this.stockThresholdService.findAll();
  }

  @ApiOperation({
    summary: 'Get a stock threshold by ID',
    description: 'This endpoint retrieves a specific stock threshold by its ID.',
  })
  @ApiResponse({ status: 200, description: 'The stock threshold data.' })
  @ApiResponse({ status: 404, description: 'Stock threshold not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StockThresholdSummary> {
    const i = await this.stockThresholdService.findOne(id);
    return i;
  }

  @ApiOperation({
    summary: 'Update a stock threshold',
    description: 'This endpoint allows you to update the details of an existing stock threshold.',
  })
  @ApiResponse({ status: 200, description: 'The updated stock threshold data.' })
  @ApiResponse({ status: 404, description: 'Stock threshold not found.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStockThresholdDto: UpdateStockThresholdDto) {
    return await this.stockThresholdService.update(id, updateStockThresholdDto);
  }

  @ApiOperation({
    summary: 'Delete a stock threshold',
    description: 'This endpoint allows you to delete a stock threshold from the system.',
  })
  @ApiResponse({ status: 200, description: 'The stock threshold has been deleted.' })
  @ApiResponse({ status: 404, description: 'Stock threshold not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.stockThresholdService.remove(id);
  }
}