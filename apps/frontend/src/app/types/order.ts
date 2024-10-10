import { Customer } from "./customer";
import { OrderLine } from "./order-line";

export interface Order {
    id?: string;
    customer: Customer;
    orderDate: string; 
    expectedDeliveryDate: string; 
    notes: string;
    nature: string; 
    status: string; 
    orderLines: OrderLine[];
  }