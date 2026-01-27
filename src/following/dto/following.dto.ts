import { ApiProperty } from '@nestjs/swagger';

export class FollowingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  followerId: string;

  @ApiProperty()
  followingId: string;

  @ApiProperty()
  createdAt: Date;
}
