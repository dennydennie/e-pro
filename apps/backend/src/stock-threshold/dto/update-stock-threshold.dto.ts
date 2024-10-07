import { PartialType } from '@nestjs/swagger';
import { CreateStockThresholdDto } from './create-stock-threshold.dto';

export class UpdateStockThresholdDto extends PartialType(
  CreateStockThresholdDto,
) {}
