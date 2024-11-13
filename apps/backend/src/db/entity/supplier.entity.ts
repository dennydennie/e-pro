/* eslint-disable prettier/prettier */
import { Entity, Column, OneToMany } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { ReviewEntity } from './review.entity';
import { PriceEntity } from './price.entity';

@Entity()
export class SupplierEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column('decimal', { precision: 10, scale: 8 })
  lat: number;

  @Column('decimal', { precision: 11, scale: 8 })
  lon: number;

  @Column()
  contactNumber: string;

  @Column()
  taxClearance: string;

  @Column({ type: 'date' })
  taxExpiry: Date;

  @Column()
  prazNumber: string;

  @Column()
  vatNumber: string;

  @OneToMany(() => ReviewEntity, (review) => review.supplier)
  reviews: ReviewEntity[];

  @OneToMany(() => PriceEntity, (price) => price.supplier)
  prices: PriceEntity[];
}
