/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Product } from 'src/product/domain/product';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) { }

  async sendLowStockAlert(
    productName: string,
    warehouse: string,
    quantityInStock: number,
    recipientEmail: string,
  ) {
    await this.mailerService.sendMail({
      to: recipientEmail,
      subject: 'Low Stock Alert',
      template: './low-stock-alert',
      context: {
        productName,
        warehouse,
        quantityInStock,
      },
    });
  }

  async sendOrderStatusChangeEmail(
    userName: string,
    products: Product[],
    orderStatus: string,
    recipientEmail: string,
    grandTotal: number,
  ) {
    await this.mailerService.sendMail({
      to: recipientEmail,
      subject: 'Order Status Update',
      template: './order-status-change',
      context: {
        userName,
        products,
        orderStatus,
        grandTotal,
      },
    });
  }
}