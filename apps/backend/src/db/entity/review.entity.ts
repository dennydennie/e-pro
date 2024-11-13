/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne } from 'typeorm';
import { SupplierEntity } from './supplier.entity';
import AbstractEntity from './abstract.entity';

@Entity()
export class ReviewEntity extends AbstractEntity {
  @Column('text')
  description: string;

  @Column('decimal', { precision: 2, scale: 1 })
  rating: number;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.reviews)
  supplier: SupplierEntity;
}
