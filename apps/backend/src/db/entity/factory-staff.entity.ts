/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FactoryEntity } from './factory.entity';
import { UserEntity } from './user.entity';
import AbstractEntity from './abstract.entity';

@Entity({ name: 'factory_staff' })
export class FactoryStaffEntity extends AbstractEntity {
  @ManyToOne(() => FactoryEntity, (factory) => factory.factoryStaff, { eager: true })
  @JoinColumn({ name: 'factory_id' })
  factory: FactoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  jobTitle: string;

  @Column()
  department: string;
}