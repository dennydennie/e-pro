/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@ApiTags('Warehouses')
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @ApiOperation({
    summary: 'Create a new warehouse',
    description: 'This endpoint allows you to create a new warehouse in the system.',
  })
  @ApiResponse({ status: 201, description: 'The warehouse has been created.' })
  @ApiResponse({ status: 400, description: 'Bad request. Check the input data.' })
  @Post()
  async create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return await this.warehouseService.create(createWarehouseDto);
  }

  @ApiOperation({
    summary: 'Get all warehouses',
    description: 'This endpoint retrieves all the warehouses in the system.',
  })
  @ApiResponse({ status: 200, description: 'The list of warehouses.' })
  @Get()
  async findAll() {
    return await this.warehouseService.findAll();
  }

  @ApiOperation({
    summary: 'Get a warehouse by ID',
    description: 'This endpoint retrieves a specific warehouse by its ID.',
  })
  @ApiResponse({ status: 200, description: 'The warehouse data.' })
  @ApiResponse({ status: 404, description: 'Warehouse not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.warehouseService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a warehouse',
    description: 'This endpoint allows you to update the details of an existing warehouse.',
  })
  @ApiResponse({ status: 200, description: 'The updated warehouse data.' })
  @ApiResponse({ status: 404, description: 'Warehouse not found.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
    return await this.warehouseService.update(id, updateWarehouseDto);
  }

  @ApiOperation({
    summary: 'Delete a warehouse',
    description: 'This endpoint allows you to delete a warehouse from the system.',
  })
  @ApiResponse({ status: 200, description: 'The warehouse has been deleted.' })
  @ApiResponse({ status: 404, description: 'Warehouse not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.warehouseService.remove(id);
  }
}