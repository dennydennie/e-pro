/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { StockRepository } from 'src/db/repository/stock.repository';
import { OrderRepository } from 'src/db/repository/order.repository';
import { PaymentRepository } from 'src/db/repository/payment.repository';

@Injectable()
export class ReportService {
  constructor(
    private stockRepository: StockRepository,
    private orderRepository: OrderRepository,
    private paymentRepository: PaymentRepository,
  ) {}

  async generateReport(createReportDto: CreateReportDto) {
    const { reportType, startDate, endDate, customerId, orderId } =
      createReportDto;

    switch (reportType) {
      case 'stocks':
        return await this.generateStocksReport(startDate, endDate);
      case 'delivery_note':
        return await this.generateDeliveryNote(customerId!, orderId!);
      case 'orders':
        return await this.generateOrdersReport(startDate, endDate, customerId);
      case 'payments':
        return await this.generatePaymentsReport(
          startDate,
          endDate,
          customerId,
        );
      default:
        throw new Error('Invalid report type');
    }
  }

  private async generateStocksReport(startDate: string, endDate: string) {
    const stocks = await this.stockRepository
      .createQueryBuilder('stock')
      .where('stock.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    return this.generatePDF('stocks', stocks);
  }

  private async generateDeliveryNote(customerId: string, orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['customer', 'orderItems', 'orderItems.product'],
    });

    if (!order || order.customer.id !== customerId) {
      throw new Error('Order not found');
    }

    return this.generatePDF('delivery_note', order);
  }

  private async generateOrdersReport(
    startDate: string,
    endDate: string,
    customerId?: string,
  ) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where('order.orderDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (customerId) {
      queryBuilder.andWhere('order.customerId = :customerId', { customerId });
    }

    const orders = await queryBuilder.getMany();
    return this.generatePDF('orders', orders);
  }

  private async generatePaymentsReport(
    startDate: string,
    endDate: string,
    customerId?: string,
  ) {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.paymentDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (customerId) {
      queryBuilder.andWhere('payment.customerId = :customerId', { customerId });
    }

    const payments = await queryBuilder.getMany();
    return this.generatePDF('payments', payments);
  }

  private generatePDF(reportType: string, data: any) {
    const doc = new PDFDocument();
    const fileName = `${reportType}-${Date.now()}.pdf`;
    const filePath = `./reports/${fileName}`;

    // Ensure reports directory exists
    if (!fs.existsSync('./reports')) {
      fs.mkdirSync('./reports');
    }

    // Create PDF write stream
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Add content based on report type
    doc.fontSize(25).text(`${reportType.toUpperCase()} REPORT`, 100, 100);
    doc.fontSize(12).text(JSON.stringify(data, null, 2), 100, 150);

    doc.end();

    // Return file path or stream the file directly
    return {
      filePath,
      fileName,
    };
  }

}
