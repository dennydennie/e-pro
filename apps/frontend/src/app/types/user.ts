export interface User {
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: "admin" | "manager" | "user"; 
    address: string;
    department: string;
}