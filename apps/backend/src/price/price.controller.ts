/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { PriceService } from './price.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Prices')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new price entry' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Price has been successfully created.' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data.' 
  })
  create(@Body() createPriceDto: CreatePriceDto) {
    return this.priceService.create(createPriceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all prices' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns all price entries' 
  })
  findAll() {
    return this.priceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a price entry by ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns the price entry' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Price entry not found' 
  })
  findOne(@Param('id') id: string) {
    return this.priceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a price entry' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Price has been successfully updated.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Price entry not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data.' 
  })
  update(@Param('id') id: string, @Body() updatePriceDto: UpdatePriceDto) {
    return this.priceService.update(id, updatePriceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a price entry' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Price has been successfully deleted.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Price entry not found' 
  })
  remove(@Param('id') id: string) {
    return this.priceService.remove(id);
  }
}
