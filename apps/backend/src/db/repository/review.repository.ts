/* eslint-disable prettier/prettier */
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ReviewEntity } from "../entity/review.entity";

@Injectable()
export class ReviewRepository extends Repository<ReviewEntity> {
    constructor(dataSource: DataSource) {
        super(ReviewEntity, dataSource.createEntityManager());
    }
}