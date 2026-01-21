import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrackDto {
  @ApiPropertyOptional({ maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
}
