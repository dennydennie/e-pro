/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { EmailService } from 'src/email/email.service';
import PaymentEntity, { PaymentStatusEnum } from 'src/db/entity/payment.entity';
import { OrderLine } from 'src/order-line/domain/order-line';
import { PaymentDetail } from './domain/payment';
import { StockService } from 'src/stock/stock.service';
import { PaymentRepository } from 'src/db/repository/payment.repository';
import { OrderRepository } from 'src/db/repository/order.repository';
import { CustomerRepository } from 'src/db/repository/customer.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly emailService: EmailService,
    private readonly stockService: StockService,
  ) { }

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    const { orderId, status } = createPaymentDto;

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    const customer = await this.customerRepository.findOne({
      where: { id: order.customer.id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      customer,
      order,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    if (status === PaymentStatusEnum.SUCCESS) {
      await this.stockService.removeStocksFromOrder(order);
      const grandTotal = order.orderLines.reduce((total, orderLine) => {
        return total + orderLine.product.price * orderLine.quantity;
      }, 0);


      const orderLines: OrderLine[] = order.orderLines.map((orderLineEntity) =>
        OrderLine.fromEntity(orderLineEntity),
      );

      await this.emailService.sendPaymentReceivedEmail(
        PaymentDetail.fromEntity(payment),
        orderLines,
        grandTotal,
      );
    }

    return savedPayment;
  }

  async findAll(): Promise<PaymentDetail[]> {
    const payments = await this.paymentRepository.find({
      relations: ['customer', 'order'],
    });

    return payments.map((payment) => PaymentDetail.fromEntity(payment))
  }

  async findOne(id: string): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['customer', 'order'],
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['customer', 'order'],
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updatedPayment = this.paymentRepository.merge(
      payment,
      updatePaymentDto,
    );
    return await this.paymentRepository.save(updatedPayment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['customer', 'order'],
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    await this.paymentRepository.remove(payment);
  }
}
