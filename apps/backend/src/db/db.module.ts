/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entity/customer.entity';
import { FactoryEntity } from './entity/factory.entity';
import { OrderLineEntity } from './entity/order-line.entity';
import { OrderEntity } from './entity/order.entity';
import { ProductEntity } from './entity/product.entity';
import { StockThresholdEntity } from './entity/stock-thershold.entity';
import { StockEntity } from './entity/stock.entity';
import { UserEntity } from './entity/user.entity';
import { WarehouseEntity } from './entity/warehouse.entity';
import { CustomerRepository } from './repository/customer.repository';
import { FactoryRepository } from './repository/factory.repository';
import { FactoryStaffRepository } from './repository/factory-staff.repository';
import { OrderRepository } from './repository/order.repository';
import { OrderLineRepository } from './repository/order-line.repository';
import { ProductRepository } from './repository/product.repository';
import { StockRepository } from './repository/stock.repository';
import { StockThresholdRepository } from './repository/stock-threshold.repository';
import { UserRepository } from './repository/user.repository';
import { WarehouseRepository } from './repository/warehouse.repository';
import { FactoryStaffEntity } from './entity/factory-staff.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CustomerEntity,
            FactoryEntity,
            FactoryStaffEntity,
            OrderLineEntity,
            OrderEntity,
            ProductEntity,
            StockThresholdEntity,
            StockEntity,
            UserEntity,
            WarehouseEntity,
        ]),
    ],
    providers: [
        CustomerRepository,
        FactoryRepository,
        FactoryStaffRepository,
        OrderRepository,
        OrderLineRepository,
        ProductRepository,
        StockRepository,
        StockThresholdRepository,
        UserRepository,
        WarehouseRepository
    ],
    exports: [
        CustomerRepository,
        FactoryRepository,
        FactoryStaffRepository,
        OrderRepository,
        OrderLineRepository,
        ProductRepository,
        StockRepository,
        StockThresholdRepository,
        UserRepository,
        WarehouseRepository
    ],
})
export class DbModule { }
