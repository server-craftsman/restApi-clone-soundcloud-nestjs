import { ApiProperty } from '@nestjs/swagger';

export class HistoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  trackId: string;

  @ApiProperty()
  listenedAt: Date;
}
