/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Create a new product',
    description: 'This endpoint allows you to create a new product in the system.',
  })
  @ApiResponse({ status: 201, description: 'The product has been created.' })
  @ApiResponse({ status: 400, description: 'Bad request. Check the input data.' })
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @ApiOperation({
    summary: 'Get all products',
    description: 'This endpoint retrieves all the products in the system.',
  })
  @ApiResponse({ status: 200, description: 'The list of products.' })
  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @ApiOperation({
    summary: 'Get a product by ID',
    description: 'This endpoint retrieves a specific product by its ID.',
  })
  @ApiResponse({ status: 200, description: 'The product data.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a product',
    description: 'This endpoint allows you to update the details of an existing product.',
  })
  @ApiResponse({ status: 200, description: 'The updated product data.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productService.update(id, updateProductDto);
  }

  @ApiOperation({
    summary: 'Delete a product',
    description: 'This endpoint allows you to delete a product from the system.',
  })
  @ApiResponse({ status: 200, description: 'The product has been deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id);
  }
}
