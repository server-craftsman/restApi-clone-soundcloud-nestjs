import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  IsEnum,
  IsBoolean,
  IsUrl,
  IsArray,
  IsISO8601,
  ValidateIf,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrackPrivacy, LicenseType, GeoblockingType } from '../../enums';
import { Transform } from 'class-transformer';

export class CreateTrackDto {
  @ApiProperty({ maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Estimated duration in seconds for quota checks',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  estimatedDurationSeconds?: number;

  // Core metadata
  @ApiPropertyOptional({ description: 'URL to track artwork image' })
  @IsOptional()
  @IsUrl()
  @MaxLength(512)
  artworkUrl?: string;

  @ApiPropertyOptional({ description: 'External track link' })
  @IsOptional()
  @IsUrl()
  @MaxLength(512)
  trackLink?: string;

  @ApiPropertyOptional({ description: 'Main artists (comma-separated)' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  mainArtists?: string;

  @ApiPropertyOptional({ description: 'Music genre' })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  genre?: string;

  @ApiPropertyOptional({ description: 'Tags (comma-separated)' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  tags?: string;

  @ApiProperty({ enum: TrackPrivacy, default: TrackPrivacy.Public })
  @IsEnum(TrackPrivacy)
  privacy: TrackPrivacy = TrackPrivacy.Public;

  @ApiPropertyOptional({
    description: 'Scheduled publish date (required if privacy is scheduled)',
  })
  @IsOptional()
  @IsISO8601()
  @ValidateIf((o: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return o.privacy === TrackPrivacy.Scheduled;
  })
  @IsNotEmpty({
    message: 'Scheduled date is required when privacy is set to scheduled',
  })
  scheduledAt?: string;

  // Advanced details
  @ApiPropertyOptional({
    description: 'Link where fans can purchase the track',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(512)
  buyLink?: string;

  @ApiPropertyOptional({ description: 'Record label name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  recordLabel?: string;

  @ApiPropertyOptional({ description: 'Release date' })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @ApiPropertyOptional({ description: 'Publisher name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  publisher?: string;

  @ApiPropertyOptional({ description: 'International Standard Recording Code' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  isrc?: string;

  @ApiPropertyOptional({
    description: 'Track contains explicit content',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  containsExplicitContent?: boolean = false;

  @ApiPropertyOptional({ description: 'P line copyright notice' })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  pLine?: string;

  // Permissions
  @ApiPropertyOptional({
    description: 'Allow direct downloads',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  enableDirectDownloads?: boolean = false;

  @ApiPropertyOptional({
    description: 'Enable offline listening',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  enableOfflineListening?: boolean = true;

  @ApiPropertyOptional({ description: 'Include in RSS feed', default: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeInRssFeed?: boolean = true;

  @ApiPropertyOptional({ description: 'Display embed code', default: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  displayEmbedCode?: boolean = true;

  @ApiPropertyOptional({ description: 'Enable app playback', default: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  enableAppPlayback?: boolean = true;

  // Engagement privacy (Pro features)
  @ApiPropertyOptional({
    description: 'Allow people to comment',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  allowComments?: boolean = true;

  @ApiPropertyOptional({
    description: 'Show comments to public',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showCommentsToPublic?: boolean = true;

  @ApiPropertyOptional({
    description: 'Show insights to public',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showInsightsToPublic?: boolean = false;

  @ApiPropertyOptional({
    enum: GeoblockingType,
    default: GeoblockingType.Worldwide,
  })
  @IsOptional()
  @IsEnum(GeoblockingType)
  geoblockingType?: GeoblockingType = GeoblockingType.Worldwide;

  @ApiPropertyOptional({
    description: 'Allowed regions for exclusive access',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  allowedRegions?: string[];

  @ApiPropertyOptional({ description: 'Blocked regions', type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  blockedRegions?: string[];

  // Audio preview
  @ApiPropertyOptional({
    description: 'Preview start time in seconds for 20-second clip',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  previewStartTime?: number;

  // Licensing
  @ApiPropertyOptional({
    enum: LicenseType,
    default: LicenseType.AllRightsReserved,
  })
  @IsOptional()
  @IsEnum(LicenseType)
  licenseType?: LicenseType = LicenseType.AllRightsReserved;
}
