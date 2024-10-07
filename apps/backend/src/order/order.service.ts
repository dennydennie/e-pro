/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from 'src/db/repository/order.repository';
import { OrderEntity } from 'src/db/entity/order.entity';
import { CustomerRepository } from 'src/db/repository/customer.repository';
import { IsNull } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const customer = await this.customerRepository.findOneBy({
      deleted: IsNull(),
      id: createOrderDto.customerId
    });

    if (!customer) {
      throw new NotFoundException('Customer does not exist')
    }

    const order = this.orderRepository.create(createOrderDto);
    order.customer = customer;
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find();
  }

  async findOne(id: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    const order = await this.findOne(id);
    this.orderRepository.merge(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}