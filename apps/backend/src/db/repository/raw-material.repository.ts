/* eslint-disable prettier/prettier */
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { RawMaterialEntity } from "../entity/raw-material.entity";

@Injectable()
export class RawMaterialRepository extends Repository<RawMaterialEntity> {
    constructor(dataSource: DataSource) {
        super(RawMaterialEntity, dataSource.createEntityManager());
    }
}