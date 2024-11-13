/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { StockRepository } from 'src/db/repository/stock.repository';
import { OrderRepository } from 'src/db/repository/order.repository';
import { PaymentRepository } from 'src/db/repository/payment.repository';
import * as path from 'path';
import { Between } from 'typeorm';
import { RawMaterialRepository } from 'src/db/repository/raw-material.repository';

@Injectable()
export class ReportService {
  constructor(
    private stockRepository: StockRepository,
    private orderRepository: OrderRepository,
    private paymentRepository: PaymentRepository,
    private rawMaterialRepository: RawMaterialRepository,
  ) { }

  async generateReport(createReportDto: CreateReportDto) {
    const { reportType, startDate, endDate, customerId, orderId, rawMaterialId } =
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
      case 'sales_forecast':
        return await this.generateSalesForecastReport(startDate, endDate);
      case 'best_supplier':
        return await this.generateBestSupplierReport(rawMaterialId!);
      default:
        throw new Error('Invalid report type');
    }
  }

  private async generateStocksReport(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const stocks = await this.stockRepository.findBy({
      created: Between(start, end)
    });

    if (!stocks || stocks.length === 0) {
      throw new Error('No stock data found for the selected date range');
    }

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
    const start = new Date(startDate);
    const end = new Date(endDate);

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderLines', 'orderLines')
      .leftJoinAndSelect('orderLines.product', 'product')
      .where('order.orderDate BETWEEN :startDate AND :endDate', {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });

    if (customerId) {
      queryBuilder.andWhere('order.customerId = :customerId', { customerId });
    }

    const orders = await queryBuilder.getMany();
    
    if (!orders || orders.length === 0) {
      throw new Error('No orders found for the selected date range');
    }

    return this.generatePDF('orders', orders);
  }

  private async generatePaymentsReport(
    startDate: string,
    endDate: string,
    customerId?: string,
  ) {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.order', 'order')
      .where('payment.created BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (customerId) {
      queryBuilder.andWhere('payment.customerId = :customerId', { customerId });
    }

    const payments = await queryBuilder.getMany();

    if (!payments || payments.length === 0) {
      throw new Error('No payments found for the selected date range');
    }

    return this.generatePDF('payments', payments);
  }

  private async generateSalesForecastReport(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get historical orders data
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderLines', 'orderLines')
      .leftJoinAndSelect('orderLines.product', 'product')
      .where('order.orderDate BETWEEN :startDate AND :endDate', {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      })
      .getMany();

    if (!orders || orders.length === 0) {
      throw new Error('No order data found for sales forecast in the selected date range');
    }

    // Calculate sales metrics
    const salesData = this.calculateSalesMetrics(orders);
    return this.generatePDF('sales_forecast', salesData);
  }

  private calculateSalesMetrics(orders: any[]) {
    // Group sales by product
    const productSales = {};
    
    orders.forEach(order => {
      order.orderLines.forEach(line => {
        const productId = line.product.id;
        if (!productSales[productId]) {
          productSales[productId] = {
            product: line.product,
            totalQuantity: 0,
            totalRevenue: 0,
            salesHistory: []
          };
        }
        
        productSales[productId].totalQuantity += line.quantity;
        productSales[productId].totalRevenue += line.quantity * line.product.price;
        productSales[productId].salesHistory.push({
          date: order.orderDate,
          quantity: line.quantity,
          revenue: line.quantity * line.product.price
        });
      });
    });

    const forecasts = Object.values(productSales).map((productData: any) => {
      const avgQuantityPerOrder = productData.totalQuantity / productData.salesHistory.length;
      const avgRevenuePerOrder = productData.totalRevenue / productData.salesHistory.length;
      
      const growthRate = 1.1; 

      return {
        product: productData.product,
        currentStats: {
          totalQuantity: productData.totalQuantity,
          totalRevenue: productData.totalRevenue,
          avgQuantityPerOrder,
          avgRevenuePerOrder
        },
        forecast: {
          nextMonthQuantity: Math.round(avgQuantityPerOrder * productData.salesHistory.length * growthRate),
          nextMonthRevenue: avgRevenuePerOrder * productData.salesHistory.length * growthRate,
          growthRate: `${((growthRate - 1) * 100).toFixed(1)}%`
        }
      };
    });

    return {
      totalOrders: orders.length,
      forecasts,
      periodStart: orders[0]?.orderDate,
      periodEnd: orders[orders.length - 1]?.orderDate
    };
  }

  private async generateBestSupplierReport(rawMaterialId: string) {
    const rawMaterial = await this.rawMaterialRepository.findOne({
      where: { id: rawMaterialId },
      relations: ['prices', 'prices.supplier', 'prices.supplier.reviews'],
    });

    if (!rawMaterial) {
      throw new Error('Raw material not found');
    }

    const suppliers = [...new Set(rawMaterial.prices.map(price => price.supplier))];

    const supplierScores = await Promise.all(
      suppliers.map(async (supplier) => {
        const latestPrice = rawMaterial.prices
          .filter(p => p.supplier.id === supplier.id)
          .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())[0];
        const priceScore = latestPrice ? this.calculatePriceScore(latestPrice.price) : 0;

        const reviewScore = this.calculateReviewScore(supplier.reviews);

        const taxScore = this.calculateTaxScore(supplier.taxExpiry);

        const prazScore = supplier.prazNumber ? 1 : 0;

        const totalScore = (priceScore * 0.3) + (reviewScore * 0.3) + (taxScore * 0.2) + (prazScore * 0.2);

        return {
          supplier,
          latestPrice: latestPrice?.price || 0,
          scores: {
            priceScore: priceScore * 0.3,
            reviewScore: reviewScore * 0.3,
            taxScore: taxScore * 0.2,
            prazScore: prazScore * 0.2,
            total: totalScore
          }
        };
      })
    );

    supplierScores.sort((a, b) => b.scores.total - a.scores.total);

    return this.generatePDF('best_supplier', {
      rawMaterial,
      supplierScores,
      generatedDate: new Date()
    });
  }

  private calculatePriceScore(price: number): number {
    return 1 / (1 + Math.log(price));
  }

  private calculateReviewScore(reviews: any[]): number {
    if (!reviews || reviews.length === 0) return 0;
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    return avgRating / 5; 
  }

  private calculateTaxScore(taxExpiry: Date): number {
    const today = new Date();
    const expiryDate = new Date(taxExpiry);
    
    if (expiryDate < today) return 0; // Expired
    
    const monthsUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    return Math.min(monthsUntilExpiry / 12, 1);
  }

  private generatePDF(reportType: string, data: any) {
    switch (reportType) {
      case 'delivery_note':
        return this.generateDeliveryNotePDF(reportType, data);
      case 'stocks':
        return this.generateStocksPDF(reportType, data);
      case 'orders':
        return this.generateOrdersPDF(reportType, data);
      case 'payments':
        return this.generatePaymentsPDF(reportType, data);
      case 'sales_forecast':
        return this.generateSalesForecastPDF(reportType, data);
      case 'best_supplier':
        return this.generateBestSupplierPDF(reportType, data);
      default:
        return this.generateReportPDF(reportType, data);
    }
  }

  private generateReportPDF(reportType: string, data: any) {
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

    //dump the data
    doc.text(JSON.stringify(cleanedData, null, 2));

    doc.end();
  }

  private generateDeliveryNotePDF(reportType: string, data: any) {
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

  private generateStocksPDF(reportType: string, data: any) {
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

    // Header
    doc.fontSize(25).text('STOCK INVENTORY REPORT', { align: 'center' });
    doc.moveDown(2);

    // Date Range
    doc.fontSize(12).text(`Report Generated: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Table Header
    doc.fontSize(14).text('Stock Details', { underline: true });
    doc.moveDown();

    // Column Headers
    const tableTop = doc.y;
    doc.fontSize(12)
      .text('Product', 50, tableTop, { width: 150 })
      .text('Warehouse', 200, tableTop, { width: 150 })
      .text('Quantity', 350, tableTop, { width: 100 })
      .text('Date', 450, tableTop, { width: 100 });

    doc.moveDown();
    const startY = doc.y;
    doc.lineWidth(1).moveTo(50, startY).lineTo(550, startY).stroke();
    doc.moveDown();

    // Table Rows
    cleanedData.forEach((stock) => {
      const y = doc.y;
      doc.fontSize(10)
        .text(stock.product?.name || 'N/A', 50, y, { width: 150 })
        .text(stock.warehouse?.name || 'N/A', 200, y, { width: 150 })
        .text(stock.quantity.toString(), 350, y, { width: 100 })
        .text(new Date(stock.date).toLocaleDateString(), 450, y, { width: 100 });

      doc.moveDown();
    });

    // Summary
    doc.moveDown(2);
    const totalQuantity = cleanedData.reduce((sum, stock) => sum + stock.quantity, 0);
    doc.fontSize(12).text(`Total Stock Quantity: ${totalQuantity}`, { underline: true });

    doc.end();

    return {
      filePath,
      fileName,
    };
  }

  private generateOrdersPDF(reportType: string, data: any) {
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

    // Header
    doc.fontSize(25).text('ORDERS REPORT', { align: 'center' });
    doc.moveDown(2);

    // Date Range
    doc.fontSize(12).text(`Report Generated: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    cleanedData.forEach((order, index) => {
      // Order Header
      doc.fontSize(14).text(`Order #${index + 1}`, { underline: true });
      doc.moveDown();

      // Order Details
      doc.fontSize(12)
        .text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`)
        .text(`Expected Delivery: ${new Date(order.expectedDeliveryDate).toLocaleDateString()}`)
        .text(`Status: ${order.status}`)
        .text(`Nature: ${order.nature}`)
        .text(`Order Classification: ${order.orderClassification}`)
        .text(`Notes: ${order.notes}`);
      doc.moveDown();

      // Order Lines Table
      doc.fontSize(12).text('Order Lines:', { underline: true });
      doc.moveDown();

      // Table Headers
      const tableTop = doc.y;
      doc.fontSize(10)
        .text('Product', 50, tableTop, { width: 200 })
        .text('Quantity', 250, tableTop, { width: 100 })
        .text('Price', 350, tableTop, { width: 100 });

      doc.moveDown();
      const startY = doc.y;
      doc.lineWidth(1).moveTo(50, startY).lineTo(550, startY).stroke();
      doc.moveDown();

      // Order Lines
      order.orderLines.forEach(line => {
        const y = doc.y;
        doc.fontSize(10)
          .text(line.product.name, 50, y, { width: 200 })
          .text(line.quantity.toString(), 250, y, { width: 100 })
          .text(line.warehouse.name, 350, y, { width: 100 })
          .text(`$${line.product.price.toFixed(2)}`, 450, y, { width: 100 });

        doc.moveDown();
      });

      // Order Total
      const orderTotal = order.orderLines.reduce((sum, line) =>
        sum + (line.quantity * line.product.price), 0);
      doc.moveDown()
        .fontSize(12)
        .text(`Order Total: $${orderTotal.toFixed(2)}`, { align: 'right' });

      // Add page break between orders (except for the last one)
      if (index < cleanedData.length - 1) {
        doc.addPage();
      }
    });

    // Summary
    doc.addPage();
    doc.fontSize(14).text('Summary', { underline: true });
    doc.moveDown();

    const totalOrders = cleanedData.length;
    const totalItems = cleanedData.reduce((sum, order) =>
      sum + order.orderLines.reduce((lineSum, line) => lineSum + line.quantity, 0), 0);
    const totalValue = cleanedData.reduce((sum, order) =>
      sum + order.orderLines.reduce((lineSum, line) =>
        lineSum + (line.quantity * line.product.price), 0), 0);

    doc.fontSize(12)
      .text(`Total Orders: ${totalOrders}`)
      .text(`Total Items: ${totalItems}`)
      .text(`Total Value: $${totalValue.toFixed(2)}`);

    doc.end();

    return {
      filePath,
      fileName,
    };
  }

  private generatePaymentsPDF(reportType: string, data: any) {
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

    // Header
    doc.fontSize(25).text('PAYMENTS REPORT', { align: 'center' });
    doc.moveDown(2);

    // Date Range
    doc.fontSize(12).text(`Report Generated: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Summary Statistics
    const totalAmount = cleanedData.reduce((sum, payment) => sum + payment.amount, 0);
    const successfulPayments = cleanedData.filter(payment => payment.status === 'Success').length;
    const failedPayments = cleanedData.filter(payment => payment.status === 'Failed').length;

    doc.fontSize(14).text('Summary', { underline: true });
    doc.moveDown();
    doc.fontSize(12)
      .text(`Total Payments: ${cleanedData.length}`)
      .text(`Total Amount: $${totalAmount.toFixed(2)}`)
      .text(`Successful Payments: ${successfulPayments}`)
      .text(`Failed Payments: ${failedPayments}`);
    doc.moveDown(2);

    // Payments Table
    doc.fontSize(14).text('Payment Details', { underline: true });
    doc.moveDown();

    // Table Headers
    const tableTop = doc.y;
    doc.fontSize(10)
      .text('Date', 50, tableTop, { width: 100 })
      .text('Amount', 150, tableTop, { width: 80 })
      .text('Status', 230, tableTop, { width: 80 })
      .text('Method', 310, tableTop, { width: 80 })
      .text('Order Date', 390, tableTop, { width: 100 });

    doc.moveDown();
    const startY = doc.y;
    doc.lineWidth(1).moveTo(50, startY).lineTo(550, startY).stroke();
    doc.moveDown();

    // Table Rows
    cleanedData.forEach(payment => {
      const y = doc.y;
      doc.fontSize(10)
        .text(new Date(payment.created).toLocaleDateString(), 50, y, { width: 100 })
        .text(`$${payment.amount.toFixed(2)}`, 150, y, { width: 80 })
        .text(payment.status, 230, y, { width: 80 })
        .text(payment.method, 310, y, { width: 80 })
        .text(new Date(payment.order.orderDate).toLocaleDateString(), 390, y, { width: 100 });

      doc.moveDown();
    });

    doc.end();

    return {
      filePath,
      fileName,
    };
  }

  private generateSalesForecastPDF(reportType: string, data: any) {
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

    // Header
    doc.fontSize(25).text('SALES FORECAST REPORT', { align: 'center' });
    doc.moveDown(2);

    // Period Information
    doc.fontSize(12)
      .text(`Analysis Period: ${new Date(cleanedData.periodStart).toLocaleDateString()} - ${new Date(cleanedData.periodEnd).toLocaleDateString()}`, { align: 'right' })
      .text(`Total Orders Analyzed: ${cleanedData.totalOrders}`, { align: 'right' });
    doc.moveDown(2);

    // Forecast Summary
    doc.fontSize(16).text('Product Forecasts', { underline: true });
    doc.moveDown();

    cleanedData.forecasts.forEach((forecast, index) => {
      // Product Header
      doc.fontSize(14).text(forecast.product.name, { underline: true });
      doc.moveDown();

      // Current Statistics
      doc.fontSize(12).text('Current Performance:');
      doc.fontSize(10)
        .text(`Total Quantity Sold: ${forecast.currentStats.totalQuantity}`)
        .text(`Total Revenue: $${forecast.currentStats.totalRevenue.toFixed(2)}`)
        .text(`Average Quantity per Order: ${forecast.currentStats.avgQuantityPerOrder.toFixed(1)}`)
        .text(`Average Revenue per Order: $${forecast.currentStats.avgRevenuePerOrder.toFixed(2)}`);
      doc.moveDown();

      // Forecast
      doc.fontSize(12).text('Forecast:');
      doc.fontSize(10)
        .text(`Expected Next Month Quantity: ${forecast.forecast.nextMonthQuantity}`)
        .text(`Expected Next Month Revenue: $${forecast.forecast.nextMonthRevenue.toFixed(2)}`)
        .text(`Projected Growth Rate: ${forecast.forecast.growthRate}`);
      doc.moveDown(2);

      // Add page break between products (except for the last one)
      if (index < cleanedData.forecasts.length - 1) {
        doc.addPage();
      }
    });

    doc.end();

    return {
      filePath,
      fileName,
    };
  }

  private generateBestSupplierPDF(reportType: string, data: any) {
    const doc = new PDFDocument();
    const fileName = `${reportType}-${Date.now()}.pdf`;
    const documentsPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Documents/advanced-scm/reports/');

    if (!fs.existsSync(documentsPath)) {
      fs.mkdirSync(documentsPath, { recursive: true });
    }

    const filePath = path.join(documentsPath, fileName);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(25).text('BEST SUPPLIER ANALYSIS', { align: 'center' });
    doc.moveDown(2);

    // Report Info
    doc.fontSize(12)
      .text(`Raw Material: ${data.rawMaterial.name}`)
      .text(`Generated: ${new Date(data.generatedDate).toLocaleDateString()}`)
      .moveDown(2);

    // Supplier Rankings
    doc.fontSize(16).text('Supplier Rankings', { underline: true });
    doc.moveDown();

    data.supplierScores.forEach((score, index) => {
      doc.fontSize(14).text(`${index + 1}. ${score.supplier.name}`);
      doc.fontSize(10)
        .text(`Total Score: ${(score.scores.total * 100).toFixed(2)}%`)
        .text(`Latest Price: $${Number(score.latestPrice).toFixed(2)}`)
        .text(`Price Score: ${(score.scores.priceScore * 100).toFixed(2)}%`)
        .text(`Review Score: ${(score.scores.reviewScore * 100).toFixed(2)}%`)
        .text(`Tax Clearance Score: ${(score.scores.taxScore * 100).toFixed(2)}%`)
        .text(`PRAZ Score: ${(score.scores.prazScore * 100).toFixed(2)}%`)
        .text(`Contact: ${score.supplier.contactNumber}`)
        .text(`Address: ${score.supplier.address}`)
        .moveDown();
    });

    // Methodology
    doc.addPage();
    doc.fontSize(16).text('Scoring Methodology', { underline: true });
    doc.moveDown();
    doc.fontSize(10)
      .text('The supplier scoring is based on the following criteria:')
      .text('• Price (30%): Lower prices receive higher scores')
      .text('• Customer Reviews (30%): Based on average rating')
      .text('• Tax Clearance (20%): Based on validity period')
      .text('• PRAZ Registration (20%): Based on having valid registration');

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
