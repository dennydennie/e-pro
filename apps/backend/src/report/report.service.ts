/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { StockRepository } from 'src/db/repository/stock.repository';
import { OrderRepository } from 'src/db/repository/order.repository';
import { PaymentRepository } from 'src/db/repository/payment.repository';
import * as path from 'path';

@Injectable()
export class ReportService {
  constructor(
    private stockRepository: StockRepository,
    private orderRepository: OrderRepository,
    private paymentRepository: PaymentRepository,
  ) { }

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
      relations: ['customer', 'orderLines', 'orderLines.product'],
    });

    if (!order || order.customer.id !== customerId) {
      throw new Error('Order not found');
    }

    const orderWithWarehouse = {
      ...order,
      orderLines: await Promise.all(
        order.orderLines.map(async (line) => {
          const stocksInWarehouses = await this.stockRepository
            .createQueryBuilder('stock')
            .where('stock.productId = :productId', { productId: line.product.id })
            .andWhere('stock.quantity >= :quantity', { quantity: line.quantity })
            .leftJoinAndSelect('stock.warehouse', 'warehouse')
            .getMany();

          const selectedWarehouseId = stocksInWarehouses[0]?.warehouseId || { name: 'Out of stock' };
          const selectedWarehouse = stocksInWarehouses.find(stock => stock.warehouseId === selectedWarehouseId);

          return {
            ...line,
            warehouse: selectedWarehouse
          };
        })
      )
    };

    return this.generatePDF('delivery_note', orderWithWarehouse);
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
    return this.generatePDF('payments', payments.map(payment => ({
      ...payment,
      order: payment.order.id
    })));
  }

  private generatePDF(reportType: string, data: any) {
    const cleanedData = this.cleanDataForReport(data);

    const doc = new PDFDocument();
    const fileName = `${reportType}-${Date.now()}.pdf`;
    const documentsPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Documents/advanced-scm/reports/');

    if (!fs.existsSync(documentsPath)) {
      fs.mkdirSync(documentsPath, { recursive: true });
    }

    const filePath = path.join(documentsPath, fileName);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(25).text(`${reportType.toUpperCase()} REPORT`, { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(14).text('Order Details', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Nature: ${cleanedData.nature}`);
    doc.text(`Status: ${cleanedData.status}`);
    doc.text(`Notes: ${cleanedData.notes}`);
    doc.moveDown();

    doc.fontSize(14).text('Customer Details', { underline: true });
    doc.moveDown();
    const customer = cleanedData.customer;
    doc.text(`Name: ${customer.name}`);
    doc.text(`Email: ${customer.email}`);
    doc.text(`Contact Person: ${customer.contactPerson}`);
    doc.text(`Mobile: ${customer.contactPersonMobile}`);
    doc.text(`Shipping Address: ${customer.shippingAddress}`);
    doc.moveDown();

    doc.fontSize(14).text('Order Lines', { underline: true });
    doc.moveDown();

    doc.fontSize(12).text('Product Name         Quantity          Price', { underline: true });

    cleanedData.orderLines.forEach(orderLine => {
      const product = orderLine.product;
      const quantity = orderLine.quantity;
      const price = product.price.toFixed(2);

      const line = `${product.name.padEnd(20)} ${String(quantity).padEnd(16)} $${price}`;
      doc.text(line);
    });

    doc.end();

    return {
      filePath,
      fileName,
    };
  }

  private cleanDataForReport(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.cleanDataForReport(item));
    }

    if (typeof data === 'object' && data !== null) {
      const cleanedObj = {};

      for (const [key, value] of Object.entries(data)) {
        if (['id', 'updatedAt', 'deletedAt'].includes(key)) {
          continue;
        }

        if (key === 'createdAt') {
          cleanedObj['date'] = new Date(value as string).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          continue;
        }

        cleanedObj[key] = this.cleanDataForReport(value);
      }

      return cleanedObj;
    }

    return data;
  }

}
