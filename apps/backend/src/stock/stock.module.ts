/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})

export class StockModule { }
