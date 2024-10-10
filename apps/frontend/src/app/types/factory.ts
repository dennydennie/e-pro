import { User } from "./user";

export interface Factory {
    id?: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    manager: User;
    phoneNumber: string;
}

export interface FactorySummary {
    readonly name: string;
    readonly address: string;
    readonly latitude: number;
    readonly longitude: number;
    readonly userId: string;
}