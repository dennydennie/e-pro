/* eslint-disable prettier/prettier */
import { Entity, Column, OneToMany } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { PriceEntity } from './price.entity';

@Entity()
export class RawMaterialEntity extends AbstractEntity {
    @Column()
    name: string;

    @Column('text')
    description: string;

    @OneToMany(() => PriceEntity, price => price.rawMaterial)
    prices: PriceEntity[];
} 