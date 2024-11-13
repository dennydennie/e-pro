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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RawMaterialService } from './raw-material.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { RawMaterialEntity } from '../db/entity/raw-material.entity';

@ApiTags('raw-materials')
@Controller('raw-material')
export class RawMaterialController {
  constructor(private readonly rawMaterialService: RawMaterialService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new raw material' })
  @ApiResponse({
    status: 201,
    description: 'Raw material successfully created',
    type: RawMaterialEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createRawMaterialDto: CreateRawMaterialDto) {
    return this.rawMaterialService.create(createRawMaterialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all raw materials' })
  @ApiResponse({
    status: 200,
    description: 'List of all raw materials',
    type: [RawMaterialEntity],
  })
  findAll() {
    return this.rawMaterialService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a raw material by id' })
  @ApiParam({ name: 'id', description: 'Raw material ID' })
  @ApiResponse({
    status: 200,
    description: 'Raw material found',
    type: RawMaterialEntity,
  })
  @ApiResponse({ status: 404, description: 'Raw material not found' })
  findOne(@Param('id') id: string) {
    return this.rawMaterialService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a raw material' })
  @ApiParam({ name: 'id', description: 'Raw material ID' })
  @ApiResponse({
    status: 200,
    description: 'Raw material updated',
    type: RawMaterialEntity,
  })
  @ApiResponse({ status: 404, description: 'Raw material not found' })
  update(
    @Param('id') id: string,
    @Body() updateRawMaterialDto: UpdateRawMaterialDto,
  ) {
    return this.rawMaterialService.update(id, updateRawMaterialDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a raw material' })
  @ApiParam({ name: 'id', description: 'Raw material ID' })
  @ApiResponse({ status: 200, description: 'Raw material deleted' })
  @ApiResponse({ status: 404, description: 'Raw material not found' })
  remove(@Param('id') id: string) {
    return this.rawMaterialService.remove(id);
  }
}
