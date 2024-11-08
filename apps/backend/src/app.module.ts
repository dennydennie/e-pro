/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CustomerModule } from './customer/customer.module';
import { FactoryModule } from './factory/factory.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { UserModule } from './user/user.module';
import { StockThresholdModule } from './stock-threshold/stock-threshold.module';
import { OrderModule } from './order/order.module';
import { OrderLineModule } from './order-line/order-line.module';
import { FactoryStaffModule } from './factory-staff/factory-staff.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { PaymentModule } from './payment/payment.module';
import { ReportModule } from './report/report.module';

export const TYPEORM_CONFIG = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    let options: TypeOrmModuleOptions = {
      type: 'postgres',
      url: configService.get<string>('DATABASE_URL'),
      synchronize: true,
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
    };

    if (!configService.get<string>('DISABLE_SSL')) {
      options = {
        ...options,
        ssl: {
          rejectUnauthorized: false,
        },
      };
    }

    return options;
  },
  inject: [ConfigService],
};

@Module({
  imports: [    
  ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(TYPEORM_CONFIG),
    DbModule,
    CustomerModule,
    FactoryModule,
    WarehouseModule,
    ProductModule,
    StockModule,
    UserModule,
    StockThresholdModule,
    OrderModule,
    OrderLineModule,
    FactoryStaffModule,
    AuthModule,
    EmailModule,
    PaymentModule,
    ReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
