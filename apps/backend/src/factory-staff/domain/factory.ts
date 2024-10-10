/* eslint-disable prettier/prettier */
import { User } from 'src/auth/domain/user';
import { FactoryStaffEntity } from 'src/db/entity/factory-staff.entity';
import { Factory } from 'src/factory/domain/factory';

export class FactoryStaff {
    id: string;
    user: User;
    factory: Factory;
    jobTitle: string;
    department: string;

    static fromEntity(entity: FactoryStaffEntity): FactoryStaff {
        return {
            id: entity.id,
            factory: Factory.fromEntity(entity.factory),
            user: User.fromEntity(entity.user),
            jobTitle: entity.jobTitle,
            department: entity.department,
        };
    }
}
