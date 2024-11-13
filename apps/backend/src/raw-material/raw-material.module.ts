/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RawMaterialService } from './raw-material.service';
import { RawMaterialController } from './raw-material.controller';
import { DbModule } from 'src/db/db.module';


@Module({
  imports: [DbModule],
  controllers: [RawMaterialController],
  providers: [RawMaterialService],
  exports: [RawMaterialService],
})
export class RawMaterialModule {}
