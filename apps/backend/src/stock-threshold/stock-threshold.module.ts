import { Module } from '@nestjs/common';
import { StockThresholdService } from './stock-threshold.service';
import { StockThresholdController } from './stock-threshold.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [StockThresholdController],
  providers: [StockThresholdService],
})
export class StockThresholdModule {}
