import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class TrackDto {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'My Awesome Track' })
  @Expose()
  title!: string;

  @ApiProperty({ example: 'A great track description', nullable: true })
  @Expose()
  description?: string | null;

  @ApiProperty({ example: 'uploaded | processing | ready | failed' })
  @Expose()
  status!: string;

  @ApiProperty({ example: 1024000 })
  @Expose()
  size!: number;

  @ApiProperty({ example: 'audio/mpeg', nullable: true })
  @Expose()
  contentType?: string;

  @ApiProperty({ example: 180.5, nullable: true })
  @Expose()
  durationSeconds?: number | null;

  @ApiProperty({ type: Date })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ type: Date })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;
}
