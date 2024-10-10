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
import { FactoryStaffService } from './factory-staff.service';
import { CreateFactoryStaffDto } from './dto/create-factory-staff.dto';
import { UpdateFactoryStaffDto } from './dto/update-factory-staff.dto';
import { FactoryStaffSummary } from './domain/factory-staff-summary';
import { FactoryStaff } from './domain/factory';

@ApiTags('Factory Staff')
@Controller('factory-staff')
export class FactoryStaffController {
  constructor(private readonly factoryStaffService: FactoryStaffService) { }

  @ApiOperation({
    summary: 'Create a new factory staff member',
    description:
      'This endpoint allows you to create a new factory staff member in the system.',
  })
  @ApiResponse({
    status: 201,
    description: 'The factory staff member has been created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Check the input data.',
  })
  @Post()
  async create(@Body() createFactoryStaffDto: CreateFactoryStaffDto) {
    return await this.factoryStaffService.create(createFactoryStaffDto);
  }

  @ApiOperation({
    summary: 'Get all factory staff members',
    description:
      'This endpoint retrieves all the factory staff members in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of factory staff members.',
  })
  @Get()
  async findAll(): Promise<FactoryStaff[]> {
    return await this.factoryStaffService.findAll();
  }

  @ApiOperation({
    summary: 'Get a factory staff member by ID',
    description:
      'This endpoint retrieves a specific factory staff member by its ID.',
  })
  @ApiResponse({ status: 200, description: 'The factory staff member data.' })
  @ApiResponse({ status: 404, description: 'Factory staff member not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FactoryStaffSummary> {
    return await this.factoryStaffService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a factory staff member',
    description:
      'This endpoint allows you to update the details of an existing factory staff member.',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated factory staff member data.',
  })
  @ApiResponse({ status: 404, description: 'Factory staff member not found.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFactoryStaffDto: UpdateFactoryStaffDto,
  ) {
    return await this.factoryStaffService.update(id, updateFactoryStaffDto);
  }

  @ApiOperation({
    summary: 'Delete a factory staff member',
    description:
      'This endpoint allows you to delete a factory staff member from the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'The factory staff member has been deleted.',
  })
  @ApiResponse({ status: 404, description: 'Factory staff member not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.factoryStaffService.remove(id);
  }
}
