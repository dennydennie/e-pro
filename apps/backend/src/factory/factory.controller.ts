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
import { FactoryService } from './factory.service';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';

@ApiTags('Factories')
@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @ApiOperation({
    summary: 'Create a new factory',
    description:
      'This endpoint allows you to create a new factory in the system.',
  })
  @ApiResponse({ status: 201, description: 'The factory has been created.' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Check the input data.',
  })
  @Post()
  async create(@Body() createFactoryDto: CreateFactoryDto) {
    return await this.factoryService.create(createFactoryDto);
  }

  @ApiOperation({
    summary: 'Get all factories',
    description: 'This endpoint retrieves all the factories in the system.',
  })
  @ApiResponse({ status: 200, description: 'The list of factories.' })
  @Get()
  async findAll() {
    return await this.factoryService.findAll();
  }

  @ApiOperation({
    summary: 'Get a factory by ID',
    description: 'This endpoint retrieves a specific factory by its ID.',
  })
  @ApiResponse({ status: 200, description: 'The factory data.' })
  @ApiResponse({ status: 404, description: 'Factory not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.factoryService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a factory',
    description:
      'This endpoint allows you to update the details of an existing factory.',
  })
  @ApiResponse({ status: 200, description: 'The updated factory data.' })
  @ApiResponse({ status: 404, description: 'Factory not found.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFactoryDto: UpdateFactoryDto,
  ) {
    return await this.factoryService.update(id, updateFactoryDto);
  }

  @ApiOperation({
    summary: 'Delete a factory',
    description:
      'This endpoint allows you to delete a factory from the system.',
  })
  @ApiResponse({ status: 200, description: 'The factory has been deleted.' })
  @ApiResponse({ status: 404, description: 'Factory not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.factoryService.remove(id);
  }
}
