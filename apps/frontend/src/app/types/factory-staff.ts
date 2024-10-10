import { Factory } from "./factory";
import { User } from "./user";

export interface FactoryStaff {
    id?: string;
    userId: string;
    factoryId: string;
    jobTitle: string;
    department: string;
}


export interface FactoryStaffDetail {
    id: string;
    user: User;
    factory: Factory;
    jobTitle: string;
    department: string;
}