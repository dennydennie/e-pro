/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('generate')
  generateReport(@Body() createReportDto: CreateReportDto) {
    return this.reportService.generateReport(createReportDto);
  }
}
