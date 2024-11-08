/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './domain/order';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: 'Create a new order',
    description: 'This endpoint allows you to create a new order in the system.',
  })
  @ApiResponse({ status: 201, description: 'The order has been created.' })
  @ApiResponse({ status: 400, description: 'Bad request. Check the input data.' })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  @ApiOperation({
    summary: 'Get all orders',
    description: 'This endpoint retrieves all the orders in the system.',
  })
  @ApiResponse({ status: 200, description: 'The list of orders.' })
  @Get()
  async findAll(): Promise<Order[]> {
    return await this.orderService.findAll();
  }

  @ApiOperation({
    summary: 'Get orders by customer ID',
    description: 'This endpoint retrieves all the orders associated with a specific customer ID.',
  })
  @ApiResponse({ status: 200, description: 'The list of orders for the customer.' })
  @ApiResponse({ status: 404, description: 'Customer not found or no orders found.' })
  @Get('customer/:customerId')
  async findOrdersByCustomer(@Param('customerId') customerId: string) {
    return await this.orderService.findOrdersByCustomer(customerId);
  }

  @ApiOperation({
    summary: 'Get an order by ID',
    description: 'This endpoint retrieves a specific order by its ID.',
  })
  @ApiResponse({ status: 200, description: 'The order data.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update an order',
    description: 'This endpoint allows you to update the details of an existing order.',
  })
  @ApiResponse({ status: 200, description: 'The updated order data.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return await this.orderService.update(id, updateOrderDto);
  }

  @ApiOperation({
    summary: 'Delete an order',
    description: 'This endpoint allows you to delete an order from the system.',
  })
  @ApiResponse({ status: 200, description: 'The order has been deleted.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderService.remove(id);
  }
}