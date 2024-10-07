import { IsString, IsNumber } from 'class-validator';
import { User } from '../domain/user';

export class UserDto {
  @IsNumber()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly role: string;

  static fromDomain(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      role: user.role,
    };
  }
}
