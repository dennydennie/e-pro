/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString } from 'class-validator';


export class CreateFactoryStaffDto {
  @ApiProperty({
    description: 'The user ID of the factory staff member',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'The ID of the factory the staff member is assigned to',
    example: 'x1y2z3a4-b5c6-d7e8-f9g0',
  })
  @IsNotEmpty()
  @IsUUID()
  factoryId: string;

  @ApiProperty({
    description: 'The job title of the factory staff member',
    example: 'Production Manager',
  })
  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @ApiProperty({
    description: 'The department the factory staff member works in',
    example: 'Production',
  })
  @IsNotEmpty()
  @IsString()
  department: string;
}
