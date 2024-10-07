import { Module } from '@nestjs/common';
import { FactoryStaffService } from './factory-staff.service';
import { FactoryStaffController } from './factory-staff.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [FactoryStaffController],
  providers: [FactoryStaffService],
})
export class FactoryStaffModule {}
