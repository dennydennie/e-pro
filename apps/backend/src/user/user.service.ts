/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from 'src/db/repository/user.repository';
import { UserEntity } from 'src/db/entity/user.entity';
import { IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
;
@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const availableByEmail = await this.userRepository.findOneBy({
      deleted: IsNull(),
      email: createUserDto.email,
    })

    if (!!availableByEmail) {
      throw new BadRequestException('User with the provided email already exist');
    }

    const availableByPhone = await this.userRepository.findOneBy({
      deleted: IsNull(),
      phoneNumber: createUserDto.phoneNumber
    });

    if (!!availableByPhone) {
      throw new BadRequestException('User with the provided number does not exist')
    }

    const user = this.userRepository.create(createUserDto);
    user.password = await bcrypt.hash(user.password, 10);

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}