import { ApiProperty } from '@nestjs/swagger';

export class StationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  likedCount: number;

  @ApiProperty()
  createdAt: Date;
}
