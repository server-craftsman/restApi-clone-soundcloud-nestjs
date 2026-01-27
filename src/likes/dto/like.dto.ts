import { ApiProperty } from '@nestjs/swagger';

export class LikeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  trackId: string;

  @ApiProperty()
  createdAt: Date;
}
