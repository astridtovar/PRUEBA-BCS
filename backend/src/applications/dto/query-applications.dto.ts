import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type {
  ApplicationChannel,
  ApplicationStatus,
} from '../entities/application.entity';

export class QueryApplicationsDto {
  @ApiPropertyOptional({
    enum: ['DRAFT', 'PENDING_VALIDATION', 'FINALIZED', 'ABANDONED'],
  })
  @IsOptional()
  @IsEnum(['DRAFT', 'PENDING_VALIDATION', 'FINALIZED', 'ABANDONED'])
  status?: ApplicationStatus;

  @ApiPropertyOptional({ enum: ['SELF_SERVICE', 'ASSISTED'] })
  @IsOptional()
  @IsEnum(['SELF_SERVICE', 'ASSISTED'])
  channel?: ApplicationChannel;

  @ApiPropertyOptional({ description: 'Search by name, document or email' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
