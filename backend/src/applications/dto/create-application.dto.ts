import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ApplicationChannel } from '../entities/application.entity';

export class CreateApplicationDto {
  @ApiProperty({ enum: ['SELF_SERVICE', 'ASSISTED'] })
  @IsEnum(['SELF_SERVICE', 'ASSISTED'])
  channel: ApplicationChannel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  advisorId?: string;
}
