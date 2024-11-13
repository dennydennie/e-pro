import { Module } from '@nestjs/common';
import { OrderLineService } from './order-line.service';
import { OrderLineController } from './order-line.controller';
import { DbModule } from 'src/db/db.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [DbModule, OrderModule],
  controllers: [OrderLineController],
  providers: [OrderLineService],
})
export class OrderLineModule {}
