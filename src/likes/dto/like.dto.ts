import { ApiProperty } from '@nestjs/swagger';
import { TrackDto } from '../../tracks/dto/track.dto';

export class LikeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  trackId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => TrackDto, required: false })
  track?: TrackDto;
}
