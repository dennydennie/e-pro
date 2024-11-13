/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from '../db/entity/review.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully created.',
    type: ReviewEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({
    status: 200,
    description: 'Returns all reviews',
    type: [ReviewEntity],
  })
  findAll(): Promise<ReviewEntity[]> {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by id' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a single review',
    type: ReviewEntity,
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ReviewEntity> {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully updated.',
    type: ReviewEntity,
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.reviewService.remove(id);
  }
}
