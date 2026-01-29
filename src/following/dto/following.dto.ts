import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';

export class FollowingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  followerId: string;

  @ApiProperty()
  followingId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => UserDto, required: false })
  follower?: UserDto;

  @ApiProperty({ type: () => UserDto, required: false })
  following?: UserDto;
}
