/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { DbModule } from 'src/db/db.module';
import { StockModule } from 'src/stock/stock.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [DbModule, StockModule, EmailModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
