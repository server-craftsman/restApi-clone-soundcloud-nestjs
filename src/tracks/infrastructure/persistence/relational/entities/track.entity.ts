import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  TrackStatus,
  TrackPrivacy,
  LicenseType,
  GeoblockingType,
} from '../../../../../enums';

@Entity({ name: 'tracks' })
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'object_key', type: 'varchar', length: 512 })
  objectKey!: string;

  @Column({
    name: 'transcoded_object_key',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  transcodedObjectKey?: string | null;

  @Column({ name: 'content_type', type: 'varchar', length: 128 })
  contentType!: string;

  @Column({
    type: 'bigint',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  size!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null | undefined) => value,
      from: (value: string | null) => (value !== null ? Number(value) : null),
    },
  })
  durationSeconds?: number | null;

  @Column({ type: 'enum', enum: TrackStatus, default: TrackStatus.Uploaded })
  status!: TrackStatus;

  // Core metadata
  @Column({ name: 'artwork_url', type: 'varchar', length: 512, nullable: true })
  artworkUrl?: string | null;

  @Column({ name: 'track_link', type: 'varchar', length: 512, nullable: true })
  trackLink?: string | null;

  @Column({ name: 'main_artists', type: 'text', nullable: true })
  mainArtists?: string | null;

  @Column({ type: 'varchar', length: 128, nullable: true })
  genre?: string | null;

  @Column({ type: 'text', nullable: true })
  tags?: string | null;

  @Column({ type: 'enum', enum: TrackPrivacy, default: TrackPrivacy.Public })
  privacy!: TrackPrivacy;

  @Column({ name: 'scheduled_at', type: 'timestamp', nullable: true })
  scheduledAt?: Date | null;

  // Advanced details
  @Column({ name: 'buy_link', type: 'varchar', length: 512, nullable: true })
  buyLink?: string | null;

  @Column({
    name: 'record_label',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  recordLabel?: string | null;

  @Column({ name: 'release_date', type: 'date', nullable: true })
  releaseDate?: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publisher?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  isrc?: string | null;

  @Column({
    name: 'contains_explicit_content',
    type: 'boolean',
    default: false,
  })
  containsExplicitContent!: boolean;

  @Column({ name: 'p_line', type: 'varchar', length: 512, nullable: true })
  pLine?: string | null;

  // Permissions
  @Column({ name: 'enable_direct_downloads', type: 'boolean', default: false })
  enableDirectDownloads!: boolean;

  @Column({ name: 'enable_offline_listening', type: 'boolean', default: true })
  enableOfflineListening!: boolean;

  @Column({ name: 'include_in_rss_feed', type: 'boolean', default: true })
  includeInRssFeed!: boolean;

  @Column({ name: 'display_embed_code', type: 'boolean', default: true })
  displayEmbedCode!: boolean;

  @Column({ name: 'enable_app_playback', type: 'boolean', default: true })
  enableAppPlayback!: boolean;

  // Engagement privacy (Pro features)
  @Column({ name: 'allow_comments', type: 'boolean', default: true })
  allowComments!: boolean;

  @Column({ name: 'show_comments_to_public', type: 'boolean', default: true })
  showCommentsToPublic!: boolean;

  @Column({ name: 'show_insights_to_public', type: 'boolean', default: false })
  showInsightsToPublic!: boolean;

  @Column({
    name: 'geoblocking_type',
    type: 'enum',
    enum: GeoblockingType,
    default: GeoblockingType.Worldwide,
  })
  geoblockingType!: GeoblockingType;

  @Column({ name: 'allowed_regions', type: 'json', nullable: true })
  allowedRegions?: string[] | null;

  @Column({ name: 'blocked_regions', type: 'json', nullable: true })
  blockedRegions?: string[] | null;

  // Audio preview
  @Column({
    name: 'preview_start_time',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null | undefined) => value,
      from: (value: string | null) => (value !== null ? Number(value) : null),
    },
  })
  previewStartTime?: number | null;

  // Licensing
  @Column({
    name: 'license_type',
    type: 'enum',
    enum: LicenseType,
    default: LicenseType.AllRightsReserved,
  })
  licenseType!: LicenseType;

  // Analytics
  @Column({ name: 'view_count', type: 'bigint', default: 0 })
  viewCount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
