/* eslint-disable prettier/prettier */
export class CreateReportDto {
  reportType: 'stocks' | 'delivery_note' | 'orders' | 'payments';
  startDate: string;
  endDate: string;
  customerId?: string;
  orderId?: string;
}
