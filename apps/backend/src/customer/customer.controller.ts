/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customers')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({
    summary: 'Create a new customer',
    description:
      'This endpoint allows you to create a new customer in the system.',
  })
  @ApiResponse({ status: 201, description: 'The customer has been created.' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Check the input data.',
  })
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.customerService.create(createCustomerDto);
  }

  @ApiOperation({
    summary: 'Get all customers',
    description: 'This endpoint retrieves all the customers in the system.',
  })
  @ApiResponse({ status: 200, description: 'The list of customers.' })
  @Get()
  async findAll() {
    return await this.customerService.findAll();
  }

  @ApiOperation({
    summary: 'Get a customer by ID',
    description: 'This endpoint retrieves a specific customer by their ID.',
  })
  @ApiResponse({ status: 200, description: 'The customer data.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.customerService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a customer',
    description:
      'This endpoint allows you to update the details of an existing customer.',
  })
  @ApiResponse({ status: 200, description: 'The updated customer data.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return await this.customerService.update(id, updateCustomerDto);
  }

  @ApiOperation({
    summary: 'Delete a customer',
    description:
      'This endpoint allows you to delete a customer from the system.',
  })
  @ApiResponse({ status: 200, description: 'The customer has been deleted.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.customerService.remove(id);
  }
}
