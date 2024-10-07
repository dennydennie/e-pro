/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderLineService } from './order-line.service';
import { CreateOrderLineDto } from './dto/create-order-line.dto';
import { UpdateOrderLineDto } from './dto/update-order-line.dto';

@ApiTags('Order Lines')
@Controller('order-line')
export class OrderLineController {
  constructor(private readonly orderLineService: OrderLineService) {}

  @ApiOperation({
    summary: 'Create a new order line',
    description: 'This endpoint allows you to create a new order line in the system.',
  })
  @ApiResponse({ status: 201, description: 'The order line has been created.' })
  @ApiResponse({ status: 400, description: 'Bad request. Check the input data.' })
  @Post()
  async create(@Body() createOrderLineDto: CreateOrderLineDto) {
    return await this.orderLineService.create(createOrderLineDto);
  }

  @ApiOperation({
    summary: 'Get all order lines',
    description: 'This endpoint retrieves all the order lines in the system.',
  })
  @ApiResponse({ status: 200, description: 'The list of order lines.' })
  @Get()
  async findAll() {
    return await this.orderLineService.findAll();
  }

  @ApiOperation({
    summary: 'Get an order line by ID',
    description: 'This endpoint retrieves a specific order line by its ID.',
  })
  @ApiResponse({ status: 200, description: 'The order line data.' })
  @ApiResponse({ status: 404, description: 'Order line not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderLineService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update an order line',
    description: 'This endpoint allows you to update the details of an existing order line.',
  })
  @ApiResponse({ status: 200, description: 'The updated order line data.' })
  @ApiResponse({ status: 404, description: 'Order line not found.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderLineDto: UpdateOrderLineDto) {
    return await this.orderLineService.update(id, updateOrderLineDto);
  }

  @ApiOperation({
    summary: 'Delete an order line',
    description: 'This endpoint allows you to delete an order line from the system.',
  })
  @ApiResponse({ status: 200, description: 'The order line has been deleted.' })
  @ApiResponse({ status: 404, description: 'Order line not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderLineService.remove(id);
  }
}