import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddTrackDto {
  @ApiProperty()
  @IsString()
  trackId: string;
}
