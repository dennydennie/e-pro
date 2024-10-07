export interface Order {
    id?: string;
    customerId: string;
    orderDate: string; 
    expectedDeliveryDate: string; 
    notes: string;
    nature: string; 
    status: string; 
  }