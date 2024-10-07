import { PartialType } from '@nestjs/swagger';
import { CreateFactoryStaffDto } from './create-factory-staff.dto';

export class UpdateFactoryStaffDto extends PartialType(CreateFactoryStaffDto) {}
