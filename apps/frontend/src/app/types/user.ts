export interface User {
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: "admin" | "manager" | "staff"; 
    address: string;
    department: string;
}