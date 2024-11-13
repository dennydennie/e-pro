/* eslint-disable prettier/prettier */
export class CreateReportDto {
  reportType: 'stocks' | 'delivery_note' | 'orders' | 'payments' | 'sales_forecast' | 'best_supplier';
  startDate: string;
  endDate: string;
  customerId?: string;
  orderId?: string;
  rawMaterialId?: string;
}
