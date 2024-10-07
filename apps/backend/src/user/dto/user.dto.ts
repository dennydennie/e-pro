/* eslint-disable prettier/prettier */
import { UserEntity } from 'src/db/entity/user.entity';

export class UserDto {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly phoneNumber: string;
    readonly role: string;
    readonly department: string;
    readonly lastLoginAt: Date | null;
    readonly isActive: boolean;

    static fromEntity(entity: UserEntity): UserDto {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            phoneNumber: entity.phoneNumber,
            role: entity.role,
            department: entity.department,
            lastLoginAt: entity.lastLoginAt,
            isActive: entity.isActive,
        };
    }
}
