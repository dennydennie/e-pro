/* eslint-disable prettier/prettier */
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { WarehouseEntity } from './warehouse.entity';
import AbstractEntity from './abstract.entity';
import { FactoryStaffEntity } from './factory-staff.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'factory' })
export class FactoryEntity extends AbstractEntity {
  @Column()
  name: string;

  @OneToMany(
    () => WarehouseEntity,
    (warehouse: WarehouseEntity) => warehouse.factory,
  )
  warehouses: WarehouseEntity[];

  @OneToMany(
    () => FactoryStaffEntity,
    (factoryStaff: FactoryStaffEntity) => factoryStaff.factory,
  )
  factoryStaff: FactoryStaffEntity[];

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id, { eager: true })
  manager: UserEntity;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;
}
