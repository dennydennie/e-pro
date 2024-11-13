/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OrderLine } from 'src/order-line/domain/order-line';
import { PaymentDetail } from 'src/payment/domain/payment';
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
    try {
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
    } catch (error) {
      console.log('Error sending email', error)
    }
  }

  async sendPaymentReceivedEmail(
    payment: PaymentDetail,
    orderLines: OrderLine[],
    grandTotal: number
  ) {
    try {
      await this.mailerService.sendMail({
        to: payment.customer.email,
        subject: 'Payment Received',
        template: './payment-received',
        context: {
          userName: payment.customer.name,
          paymentAmount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.method,
          paymentStatus: payment.status,
          orderId: payment.order.id,
          orderStatus: payment.order.status,
          orderLines,
          grandTotal,
        },
      });
    } catch (error) {
      console.log('Error sending email', error)
    }

  }

  async sendOrderStatusChangeEmail(
    userName: string,
    products: Product[],
    orderStatus: string,
    recipientEmail: string,
    grandTotal: number,
  ) {
    try {
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
    } catch (error) {
      console.log('Error sending email', error);
    }
  }
}