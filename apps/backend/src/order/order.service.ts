/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from 'src/db/repository/order.repository';
import { OrderEntity } from 'src/db/entity/order.entity';
import { CustomerRepository } from 'src/db/repository/customer.repository';
import { IsNull } from 'typeorm';
import { Order } from './domain/order';
import { OrderClassification } from './enum/order-classification.enum';

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

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.find();

    return orders.map((order) => Order.fromEntity(order));
  }

  async findOne(id: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findOrdersByCustomer(customerId: string) {
    const orders = await this.orderRepository.find({ where: { customer: { id: customerId } } });
    if (!orders) {
      throw new NotFoundException(`No orders found for customer ID ${customerId}`);
    }
    return orders;
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
  
  async updateOrderType(orderId: string): Promise<void> {

    const order = await this.orderRepository.findOneBy({
      id: orderId
    })

    const totalCost = order.orderLines.reduce((sum, line) => sum + (line.product.price * line.quantity), 0);
    const totalQuantity = order.orderLines.reduce((sum, line) => sum + line.quantity, 0);

    if (totalCost > 2000 && totalQuantity > 1000) {
      order.classification = OrderClassification.STRATEGIC;
    } else if (totalCost < 2000 && totalQuantity < 500) {
      order.classification = OrderClassification.OPERATIONAL;
    } else if (totalCost > 10000 && totalQuantity > 5000) {
      order.classification = OrderClassification.COLLABORATIVE;
    }

    await this.orderRepository.update(orderId, {...order})
  }
}