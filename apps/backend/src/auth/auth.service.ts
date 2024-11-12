/* eslint-disable prettier/prettier */
import { Injectable, NotAcceptableException } from '@nestjs/common';
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

    if (!user) {
      throw new NotAcceptableException('Wrong email or password');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new NotAcceptableException('Wrong email or password');
    }

    return User.fromEntity(user);
  }
}
