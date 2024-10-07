export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    unit: "kg" | "L";
    mass?: number;
    volume?: number;
    dimensions: string;
    expiryDate: string;
}