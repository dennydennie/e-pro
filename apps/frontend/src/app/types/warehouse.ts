import { Factory } from "./factory";

export interface Warehouse {
    factory: Factory;
    id?: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phoneNumber: string;
    maxCapacity: number;
}