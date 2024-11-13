/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from '../db/entity/review.entity';
import { ReviewRepository } from 'src/db/repository/review.repository';
import { SupplierRepository } from 'src/db/repository/supplier.repository';

@Injectable()
export class ReviewService {
  constructor(
    private reviewRepository: ReviewRepository,
    private supplierRepository: SupplierRepository,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    const supplier = await this.supplierRepository.findOne({
      where: { id: createReviewDto.supplierId },
    });

    if (!supplier) {
      throw new NotFoundException(
        `Supplier with ID ${createReviewDto.supplierId} not found`,
      );
    }

    const review = this.reviewRepository.create({
      description: createReviewDto.description,
      rating: createReviewDto.rating,
      supplier: supplier,
    });

    return this.reviewRepository.save(review);
  }

  async findAll(): Promise<ReviewEntity[]> {
    return this.reviewRepository.find({
      relations: ['supplier'],
    });
  }

  async findOne(id: string): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    const review = await this.findOne(id);

    // If supplierId is provided, verify and update supplier
    if (updateReviewDto.supplierId) {
      const supplier = await this.supplierRepository.findOne({
        where: { id: updateReviewDto.supplierId },
      });

      if (!supplier) {
        throw new NotFoundException(
          `Supplier with ID ${updateReviewDto.supplierId} not found`,
        );
      }
      review.supplier = supplier;
    }

    // Update other fields if provided
    if (updateReviewDto.description !== undefined) {
      review.description = updateReviewDto.description;
    }
    if (updateReviewDto.rating !== undefined) {
      review.rating = updateReviewDto.rating;
    }

    return this.reviewRepository.save(review);
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }
}
