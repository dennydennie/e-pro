/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],    
  controllers: [PriceController],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
