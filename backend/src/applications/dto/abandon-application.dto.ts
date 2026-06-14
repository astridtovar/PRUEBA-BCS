import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AbandonApplicationDto {
  @ApiProperty({ example: 'No longer interested in the loan' })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  reason: string;
}
