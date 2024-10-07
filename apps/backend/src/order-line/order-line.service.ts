/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderLineDto } from './dto/create-order-line.dto';
import { UpdateOrderLineDto } from './dto/update-order-line.dto';
import { OrderLineEntity } from 'src/db/entity/order-line.entity';
import { OrderLineRepository } from 'src/db/repository/order-line.repository';
import { ProductRepository } from 'src/db/repository/product.repository';
import { OrderRepository } from 'src/db/repository/order.repository';
import { IsNull } from 'typeorm';

@Injectable()
export class OrderLineService {
  constructor(
    private orderLineRepository: OrderLineRepository,
    private productRepository: ProductRepository,
    private orderRepository: OrderRepository,
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

    return await this.orderLineRepository.save(orderLine);
}

  async findAll(): Promise<OrderLineEntity[]> {
    return await this.orderLineRepository.find();
  }

  async findOne(id: string): Promise<OrderLineEntity> {
    const orderLine = await this.orderLineRepository.findOne({ where: { id } });
    if (!orderLine) {
      throw new NotFoundException(`Order line with ID ${id} not found`);
    }
    return orderLine;
  }

  async update(
    id: string,
    updateOrderLineDto: UpdateOrderLineDto,
  ): Promise<OrderLineEntity> {
    const orderLine = await this.findOne(id);
    this.orderLineRepository.merge(orderLine, updateOrderLineDto);
    return await this.orderLineRepository.save(orderLine);
  }

  async remove(id: string): Promise<void> {
    const orderLine = await this.findOne(id);
    await this.orderLineRepository.remove(orderLine);
  }
}
