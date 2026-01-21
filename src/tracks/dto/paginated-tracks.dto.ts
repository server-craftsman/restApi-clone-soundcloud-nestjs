import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TrackDto } from './track.dto';

export class PaginatedTracksDto {
  @ApiProperty({ isArray: true, type: TrackDto })
  @Expose()
  @Type(() => TrackDto)
  data!: TrackDto[];

  @ApiProperty({ example: 100 })
  @Expose()
  total!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  limit!: number;

  @ApiProperty({ example: 0 })
  @Expose()
  offset!: number;
}
