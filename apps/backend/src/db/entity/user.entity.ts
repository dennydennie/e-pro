/* eslint-disable prettier/prettier */
import { Entity, Column } from 'typeorm';
import AbstractEntity from './abstract.entity';


@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
    @Column()
    password: string;

    @Column()
    role: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phoneNumber: string;

    @Column()
    department: string;

    @Column()
    address?: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt: Date;

    @Column({ nullable: true })
    resetPasswordToken: string;
}