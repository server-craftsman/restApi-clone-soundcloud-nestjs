import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class TrackDto {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'My Awesome Track' })
  @Expose()
  title!: string;

  @ApiPropertyOptional({ example: 'A great track description', nullable: true })
  @Expose()
  description?: string | null;

  @ApiProperty({ example: 'uploaded | processing | ready | failed' })
  @Expose()
  status!: string;

  @ApiProperty({ example: 1024000 })
  @Expose()
  size!: number;

  @ApiPropertyOptional({ example: 'audio/mpeg', nullable: true })
  @Expose()
  contentType?: string;

  @ApiPropertyOptional({ example: 180.5, nullable: true })
  @Expose()
  durationSeconds?: number | null;

  // Core metadata
  @ApiPropertyOptional({ example: 'https://example.com/artwork.jpg', nullable: true })
  @Expose()
  artworkUrl?: string | null;

  @ApiPropertyOptional({ example: 'https://soundcloud.com/artist/track', nullable: true })
  @Expose()
  trackLink?: string | null;

  @ApiPropertyOptional({ example: 'Artist Name, Another Artist', nullable: true })
  @Expose()
  mainArtists?: string | null;

  @ApiPropertyOptional({ example: 'Electronic', nullable: true })
  @Expose()
  genre?: string | null;

  @ApiPropertyOptional({ example: 'electronic, dance, music', nullable: true })
  @Expose()
  tags?: string | null;

  @ApiProperty({ example: 'public', enum: ['public', 'private', 'scheduled'] })
  @Expose()
  privacy!: string;

  @ApiPropertyOptional({ type: Date, nullable: true })
  @Expose()
  @Type(() => Date)
  scheduledAt?: Date | null;

  // Advanced details
  @ApiPropertyOptional({ example: 'https://store.example.com/track', nullable: true })
  @Expose()
  buyLink?: string | null;

  @ApiPropertyOptional({ example: 'My Record Label', nullable: true })
  @Expose()
  recordLabel?: string | null;

  @ApiPropertyOptional({ type: Date, nullable: true })
  @Expose()
  @Type(() => Date)
  releaseDate?: Date | null;

  @ApiPropertyOptional({ example: 'My Publisher', nullable: true })
  @Expose()
  publisher?: string | null;

  @ApiPropertyOptional({ example: 'USRC17607839', nullable: true })
  @Expose()
  isrc?: string | null;

  @ApiProperty({ example: false })
  @Expose()
  containsExplicitContent!: boolean;

  @ApiPropertyOptional({ example: '℗ 2024 Artist Name', nullable: true })
  @Expose()
  pLine?: string | null;

  // Permissions
  @ApiProperty({ example: false })
  @Expose()
  enableDirectDownloads!: boolean;

  @ApiProperty({ example: true })
  @Expose()
  enableOfflineListening!: boolean;

  @ApiProperty({ example: true })
  @Expose()
  includeInRssFeed!: boolean;

  @ApiProperty({ example: true })
  @Expose()
  displayEmbedCode!: boolean;

  @ApiProperty({ example: true })
  @Expose()
  enableAppPlayback!: boolean;

  // Engagement privacy (Pro features)
  @ApiProperty({ example: true })
  @Expose()
  allowComments!: boolean;

  @ApiProperty({ example: true })
  @Expose()
  showCommentsToPublic!: boolean;

  @ApiProperty({ example: false })
  @Expose()
  showInsightsToPublic!: boolean;

  @ApiProperty({ example: 'worldwide', enum: ['worldwide', 'exclusive-regions', 'blocked-regions'] })
  @Expose()
  geoblockingType!: string;

  @ApiPropertyOptional({ type: [String], nullable: true })
  @Expose()
  allowedRegions?: string[] | null;

  @ApiPropertyOptional({ type: [String], nullable: true })
  @Expose()
  blockedRegions?: string[] | null;

  // Audio preview
  @ApiPropertyOptional({ example: 30.5, nullable: true })
  @Expose()
  previewStartTime?: number | null;

  // Licensing
  @ApiProperty({ example: 'all-rights-reserved', enum: ['all-rights-reserved', 'creative-commons'] })
  @Expose()
  licenseType!: string;

  @ApiProperty({ type: Date })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ type: Date })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;
}
