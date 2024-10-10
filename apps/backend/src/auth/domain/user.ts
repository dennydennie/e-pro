/* eslint-disable prettier/prettier */
import { UserEntity } from "src/db/entity/user.entity";

export class User {
  readonly id?: string;
  readonly role?: string;
  readonly name?: string;
  readonly email?: string;
  readonly phoneNumber?: string;
  readonly department?: string;
  readonly address?: string;

  static fromEntity(entity: UserEntity): User {
    return {
      id: entity?.id,
      role: entity?.role,
      name: entity?.name,
      email: entity?.email,
      phoneNumber: entity?.phoneNumber,
      department: entity?.department,
      address: entity?.address,
    };
  }
}