/* eslint-disable prettier/prettier */
import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    DataSource,
} from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { Inject, Logger } from '@nestjs/common';
import { StockThresholdEntity } from '../entity/stock-thershold.entity';
import { StockEntity } from '../entity/stock.entity';
import { EmailService } from 'src/email/email.service';

@EventSubscriber()
export class StockSubscriber implements EntitySubscriberInterface<StockEntity> {
    private readonly logger = new Logger(StockSubscriber.name);

    constructor(
        @Inject(EmailService) private readonly mailService: EmailService,
        @Inject(DataSource) dataSource: DataSource,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return StockEntity;
    }

    async afterInsert(event: InsertEvent<StockEntity>): Promise<void> {
        await this.checkStockLevel(event);
    }

    async afterUpdate(event: UpdateEvent<StockEntity>): Promise<void> {
        await this.checkStockLevel(event);
    }

    private async checkStockLevel(
        event: InsertEvent<StockEntity> | UpdateEvent<StockEntity>,
    ): Promise<void> {
        const stock = event.entity;
        const stockThresholdRepo =
            event.manager.getRepository(StockThresholdEntity);
        const stockThresholds = await stockThresholdRepo.find({
            where: {
                product: { id: stock.productId },
                warehouse: { id: stock.warehouseId },
            },
            relations: ['product', 'warehouse'],
        });

        const currentQuantity = stock.quantity;

        const adminUsers = await event.manager.find(UserEntity, {
            where: { role: 'admin', deleted: null },
        });

        if (adminUsers.length < 1) {
            this.logger.warn('No admin users : Skipping sending low stock emails');
        }

        for (const threshold of stockThresholds) {
            if (
                currentQuantity <= threshold.lowStockThreshold ||
                currentQuantity >= threshold.highStockThreshold
            ) {
                const recipientEmails = adminUsers.map((user) => user.email);

                for (const email of recipientEmails) {
                    await this.mailService.sendLowStockAlert(
                        threshold.product.name,
                        threshold.warehouse.name,
                        currentQuantity,
                        email,
                    );
                }
            }
        }
    }
}
