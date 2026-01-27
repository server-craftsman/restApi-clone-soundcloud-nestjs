import { 
  IsOptional, 
  IsString, 
  MaxLength, 
  IsEnum,
  IsBoolean,
  IsUrl,
  IsArray,
  IsNumber,
  IsPositive,
  IsDateString,
  IsISO8601,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrackPrivacy, LicenseType, GeoblockingType } from '../../enums';
import { Transform, Type } from 'class-transformer';

export class UpdateTrackDto {
  @ApiPropertyOptional({ maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

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

  @ApiPropertyOptional({ enum: TrackPrivacy })
  @IsOptional()
  @IsEnum(TrackPrivacy)
  privacy?: TrackPrivacy;

  @ApiPropertyOptional({ description: 'Scheduled publish date (required if privacy is scheduled)' })
  @IsOptional()
  @IsISO8601()
  @ValidateIf(o => o.privacy === TrackPrivacy.Scheduled)
  @IsNotEmpty({ message: 'Scheduled date is required when privacy is set to scheduled' })
  scheduledAt?: string;

  // Advanced details
  @ApiPropertyOptional({ description: 'Link where fans can purchase the track' })
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

  @ApiPropertyOptional({ description: 'Track contains explicit content' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  containsExplicitContent?: boolean;

  @ApiPropertyOptional({ description: 'P line copyright notice' })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  pLine?: string;

  // Permissions
  @ApiPropertyOptional({ description: 'Allow direct downloads' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  enableDirectDownloads?: boolean;

  @ApiPropertyOptional({ description: 'Enable offline listening' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  enableOfflineListening?: boolean;

  @ApiPropertyOptional({ description: 'Include in RSS feed' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeInRssFeed?: boolean;

  @ApiPropertyOptional({ description: 'Display embed code' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  displayEmbedCode?: boolean;

  @ApiPropertyOptional({ description: 'Enable app playback' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  enableAppPlayback?: boolean;

  // Engagement privacy (Pro features)
  @ApiPropertyOptional({ description: 'Allow people to comment' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  allowComments?: boolean;

  @ApiPropertyOptional({ description: 'Show comments to public' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showCommentsToPublic?: boolean;

  @ApiPropertyOptional({ description: 'Show insights to public' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showInsightsToPublic?: boolean;

  @ApiPropertyOptional({ enum: GeoblockingType })
  @IsOptional()
  @IsEnum(GeoblockingType)
  geoblockingType?: GeoblockingType;

  @ApiPropertyOptional({ description: 'Allowed regions for exclusive access', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  allowedRegions?: string[];

  @ApiPropertyOptional({ description: 'Blocked regions', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  blockedRegions?: string[];

  // Audio preview
  @ApiPropertyOptional({ description: 'Preview start time in seconds for 20-second clip' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  previewStartTime?: number;

  // Licensing
  @ApiPropertyOptional({ enum: LicenseType })
  @IsOptional()
  @IsEnum(LicenseType)
  licenseType?: LicenseType;
}
