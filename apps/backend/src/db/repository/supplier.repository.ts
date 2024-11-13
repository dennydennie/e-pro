/* eslint-disable prettier/prettier */
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SupplierEntity } from "../entity/supplier.entity";

@Injectable()
export class SupplierRepository extends Repository<SupplierEntity> {
    constructor(dataSource: DataSource) {
        super(SupplierEntity, dataSource.createEntityManager());
    }
}