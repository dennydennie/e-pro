/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderLineDto } from './dto/create-order-line.dto';
import { UpdateOrderLineDto } from './dto/update-order-line.dto';
import { OrderLineEntity } from 'src/db/entity/order-line.entity';
import { OrderLineRepository } from 'src/db/repository/order-line.repository';
import { ProductRepository } from 'src/db/repository/product.repository';
import { OrderRepository } from 'src/db/repository/order.repository';
import { IsNull } from 'typeorm';
import { OrderLine } from './domain/order-line';
import { OrderLineSummary } from './domain/order-line-summary';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class OrderLineService {
  constructor(
    private orderLineRepository: OrderLineRepository,
    private productRepository: ProductRepository,
    private orderRepository: OrderRepository,
    private orderService: OrderService,
  ) { }

  async create(createOrderLineDto: CreateOrderLineDto): Promise<OrderLineEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id: createOrderLineDto.productId,
        deleted: IsNull(),
      },
    });

    if (!product) {
      throw new BadRequestException('Product does not exist');
    }

    const order = await this.orderRepository.findOne({
      where: {
        id: createOrderLineDto.orderId,
        deleted: IsNull(),
      },
    });

    if (!order) {
      throw new BadRequestException('Order does not exist');
    }

    const orderLine = this.orderLineRepository.create(createOrderLineDto);

    orderLine.productId = product.id;
    orderLine.orderId = order.id;
    orderLine.order = order;

    const orderLineEntity = await this.orderLineRepository.save(orderLine);
    await this.orderService.updateOrderType(order.id)

    return orderLineEntity;
  }

  async findAll(): Promise<OrderLineEntity[]> {
    return await this.orderLineRepository.find();
  }

  async findOne(id: string): Promise<OrderLineSummary> {
    const orderLine = await this.orderLineRepository.findOne({ where: { id } });
    if (!orderLine) {
      throw new NotFoundException(`Order line with ID ${id} not found`);
    }
    const product = await this.productRepository.findOneBy({
      deleted: IsNull(),
      id: orderLine.productId,
    })

    const order = await this.orderRepository.findOneBy({
      deleted: IsNull(),
      id: orderLine.orderId
    })
    return OrderLineSummary.fromEntity({
      order,
      product,
      ...orderLine,
    })
  }

  async findAllByOrder(orderId: string): Promise<OrderLine[]> {
    const orderLines = await this.orderLineRepository.find({ where: { orderId } });
    if (!orderLines || orderLines.length === 0) {
      throw new NotFoundException(`No order lines found for order ID ${orderId}`);
    }

    const orderLinePromises = orderLines.map(async (orderLine) => {
      const product = await this.productRepository.findOneBy({
        deleted: IsNull(),
        id: orderLine.productId,
      });

      const order = await this.orderRepository.findOneBy({
        deleted: IsNull(),
        id: orderLine.orderId,
      });

      return OrderLine.fromEntity({
        order,
        product,
        ...orderLine,
      });
    });

    return Promise.all(orderLinePromises);
  }

  async update(
    id: string,
    updateOrderLineDto: UpdateOrderLineDto,
  ): Promise<OrderLineEntity> {
    const orderLine = await this.orderLineRepository.findOne({ where: { id } });
    this.orderLineRepository.merge(orderLine, updateOrderLineDto);
    const newLine = await this.orderLineRepository.save(orderLine);

    await this.orderService.updateOrderType(orderLine.orderId);
    return newLine;
  }

  async remove(id: string): Promise<void> {
    const orderLine = await this.orderLineRepository.findOne({ where: { id } });
    await this.orderLineRepository.remove(orderLine);
    await this.orderService.updateOrderType(orderLine.orderId);
  }
}
