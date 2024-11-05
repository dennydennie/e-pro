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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentSummary } from './domain/payment-summary';
import { PaymentDetail } from './domain/payment';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @ApiOperation({
    summary: 'Create a new payment',
    description: 'This endpoint allows you to create a new payment in the system.',
  })
  @ApiResponse({ status: 201, description: 'The payment has been created.' })
  @ApiResponse({ status: 400, description: 'Bad request. Check the input data.' })
  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.create(createPaymentDto);
  }

  @ApiOperation({
    summary: 'Get all payments',
    description: 'This endpoint retrieves all the payments in the system.',
  })
  @ApiResponse({ status: 200, description: 'The list of payments.' })
  @Get()
  async findAll() {
    return await this.paymentService.findAll();
  }

  @ApiOperation({
    summary: 'Get a payment by ID',
    description: 'This endpoint retrieves a specific payment summary by its ID.',
  })
  @ApiResponse({ status: 200, description: 'The payment data.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  @Get('/summary/:id')
  async findSummary(@Param('id') id: string): Promise<PaymentDetail> {
    const payment = await this.paymentService.findOne(id);
    return PaymentDetail.fromEntity(payment);
  }

  @ApiOperation({
    summary: 'Get a payment by ID',
    description: 'This endpoint retrieves a specific payment by its ID.',
  })
  @ApiResponse({ status: 200, description: 'The payment data.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PaymentSummary> {
    const payment = await this.paymentService.findOne(id);
    return PaymentSummary.fromEntity(payment);
  }

  @ApiOperation({
    summary: 'Update a payment',
    description: 'This endpoint allows you to update the details of an existing payment.',
  })
  @ApiResponse({ status: 200, description: 'The updated payment data.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return await this.paymentService.update(id, updatePaymentDto);
  }

  @ApiOperation({
    summary: 'Delete a payment',
    description: 'This endpoint allows you to delete a payment from the system.',
  })
  @ApiResponse({ status: 200, description: 'The payment has been deleted.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.paymentService.remove(id);
  }
}