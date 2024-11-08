/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
