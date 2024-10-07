export interface Customer {
    id?: string;
    name: string;
    email: string;
    contactPerson: string;
    contactPersonMobile: string;
    shippingAddress: string;
    shippingLatitude: number;
    shippingLongitude: number;
}