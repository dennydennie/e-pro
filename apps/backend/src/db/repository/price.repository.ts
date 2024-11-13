/* eslint-disable prettier/prettier */
import { DataSource, Repository } from "typeorm";
import { PriceEntity } from "../entity/price.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PriceRepository extends Repository<PriceEntity> {
    constructor(dataSource: DataSource) {
        super(PriceEntity, dataSource.createEntityManager());
    }
}