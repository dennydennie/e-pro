import { UserEntity } from "src/db/entity/user.entity";

export class User {
  readonly id: string;
  readonly name: string;
  readonly role: string;

  static fromEntity(entity: UserEntity): User {
    return {
      id: entity.id,
      name: entity.name,
      role: entity.role,
    };
  }
}
