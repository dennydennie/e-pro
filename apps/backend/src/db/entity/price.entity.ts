/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne } from 'typeorm';
import { SupplierEntity } from './supplier.entity';
import { RawMaterialEntity } from './raw-material.entity';
import AbstractEntity from './abstract.entity';

@Entity()
export class PriceEntity extends AbstractEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.prices)
  supplier: SupplierEntity;

  @ManyToOne(() => RawMaterialEntity, (rawMaterial) => rawMaterial.prices)
  rawMaterial: RawMaterialEntity;
}
