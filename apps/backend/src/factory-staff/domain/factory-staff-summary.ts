/* eslint-disable prettier/prettier */
import { FactoryStaffEntity } from 'src/db/entity/factory-staff.entity';

export class FactoryStaffSummary {
    id: string;
    userId: string;
    factoryId: string;
    jobTitle: string;
    department: string;

    static fromEntity(entity: FactoryStaffEntity): FactoryStaffSummary {
        return {
            id: entity.id,
            factoryId: entity.factory.id,
            userId: entity.user.id,
            jobTitle: entity.jobTitle,
            department: entity.department,
        };
    }
}
