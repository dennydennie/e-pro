/* eslint-disable prettier/prettier */
export class CreateReportDto {
  reportType: 'stocks' | 'delivery_note' | 'orders' | 'payments' | 'sales_forecast';
  startDate: string;
  endDate: string;
  customerId?: string;
  orderId?: string;
}
