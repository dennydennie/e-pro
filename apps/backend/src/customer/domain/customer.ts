/* eslint-disable prettier/prettier */
import { CustomerEntity } from 'src/db/entity/customer.entity';

export class Customer {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly contactPerson: string;
    readonly contactPersonMobile: string;
    readonly shippingAddress: string;
    readonly shippingLatitude: number;
    readonly shippingLongitude: number;

    static fromEntity(entity: CustomerEntity): Customer {
        return {
            id: entity?.id,
            name: entity?.name,
            email: entity?.email,
            contactPerson: entity?.contactPerson,
            contactPersonMobile: entity?.contactPersonMobile,
            shippingAddress: entity?.shippingAddress,
            shippingLatitude: entity?.shippingLatitude,
            shippingLongitude: entity?.shippingLongitude,
        };
    }
}
