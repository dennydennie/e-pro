/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './domain/user';
import { IsNull } from 'typeorm';
import { UserRepository } from 'src/db/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) { }

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email: email,
      deleted: IsNull(),
    });

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      throw new UnauthorizedException();
    }

    return User.fromEntity(user);
  }
}
