import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';
import { StorageService } from '../../storage/storage.service';
import {
  MEDIA_TRANSCODE_JOB,
  MEDIA_TRANSCODE_QUEUE,
} from '../../queue/queue.constants';
import { Track } from '../domain/track';
import { TrackRepository } from '../infrastructure/persistence/relational/track.repository';
import { SubscriptionPlan, TrackStatus, TrackPrivacy } from '../../enums';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/domain/user';
import { StreamPayload } from '../interfaces';
import { BaseService } from '../../core/base/base.service';

@Injectable()
export class TracksService extends BaseService {
  private readonly logger = new Logger(TracksService.name);
  private readonly freeLimitSeconds: number;
  private readonly proLimitSeconds: number;
  private readonly maxFileSizeBytes: number;

  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @InjectQueue(MEDIA_TRANSCODE_QUEUE)
    private readonly mediaQueue: Queue,
  ) {
    super();
    this.freeLimitSeconds =
      (this.configService.get<number>('UPLOAD_FREE_MINUTES') ?? 180) * 60;
    this.proLimitSeconds =
      (this.configService.get<number>('UPLOAD_PRO_MINUTES') ?? 0) * 60;
    this.maxFileSizeBytes =
      this.configService.get<number>('UPLOAD_MAX_FILE_SIZE_BYTES') ??
      4 * 1024 * 1024 * 1024;
  }

  async createFromUpload(
    file: Express.Multer.File,
    dto: CreateTrackDto,
    userId: string,
  ): Promise<Track> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    if (file.size > this.maxFileSizeBytes) {
      throw new BadRequestException(
        `File too large. Max allowed is ${this.formatBytes(this.maxFileSizeBytes)}.`,
      );
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Uploader not found');
    }

    // Validate Pro plan features
    this.validateProFeatures(dto, user);

    // Validate scheduled privacy
    this.validateScheduledPrivacy(dto);

    const planLimitSeconds = this.resolvePlanLimitSeconds(user);
    const currentUsageSeconds =
      await this.trackRepository.getTotalDurationSecondsByUser(userId);
    const estimatedDurationSeconds = dto.estimatedDurationSeconds ?? 0;

    if (
      planLimitSeconds !== Infinity &&
      currentUsageSeconds + estimatedDurationSeconds > planLimitSeconds
    ) {
      throw new BadRequestException('Upload quota exceeded for current plan');
    }

    const objectKey = `${randomUUID()}-${file.originalname}`;
    await this.storageService.uploadBuffer(
      objectKey,
      file.buffer,
      file.mimetype,
    );

    const track = await this.trackRepository.create({
      title: dto.title,
      description: dto.description,
      userId: userId,
      objectKey,
      contentType: file.mimetype,
      size: file.size,
      durationSeconds: dto.estimatedDurationSeconds,
      status: TrackStatus.Uploaded,

      // Core metadata
      artworkUrl: dto.artworkUrl,
      trackLink: dto.trackLink,
      mainArtists: dto.mainArtists,
      genre: dto.genre,
      tags: dto.tags,
      privacy: dto.privacy,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,

      // Advanced details
      buyLink: dto.buyLink,
      recordLabel: dto.recordLabel,
      releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : null,
      publisher: dto.publisher,
      isrc: dto.isrc,
      containsExplicitContent: dto.containsExplicitContent ?? false,
      pLine: dto.pLine,

      // Permissions
      enableDirectDownloads: dto.enableDirectDownloads ?? false,
      enableOfflineListening: dto.enableOfflineListening ?? true,
      includeInRssFeed: dto.includeInRssFeed ?? true,
      displayEmbedCode: dto.displayEmbedCode ?? true,
      enableAppPlayback: dto.enableAppPlayback ?? true,

      // Engagement privacy
      allowComments: dto.allowComments ?? true,
      showCommentsToPublic: dto.showCommentsToPublic ?? true,
      showInsightsToPublic: dto.showInsightsToPublic ?? false,
      geoblockingType: dto.geoblockingType,
      allowedRegions: dto.allowedRegions,
      blockedRegions: dto.blockedRegions,

      // Audio preview
      previewStartTime: dto.previewStartTime,

      // Licensing
      licenseType: dto.licenseType,
    });

    await this.mediaQueue.add(MEDIA_TRANSCODE_JOB, {
      trackId: track.id,
      sourceKey: objectKey,
      targetKey: `${track.id}.mp3`,
    });

    return track;
  }

  async findOneOrFail(id: string): Promise<Track> {
    const track = await this.trackRepository.findById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async update(
    id: string,
    dto: UpdateTrackDto,
    userId?: string,
  ): Promise<Track> {
    const track = await this.findOneOrFail(id);

    // If userId is provided, verify ownership
    if (userId && track.userId !== userId) {
      throw new BadRequestException('You can only update your own tracks');
    }

    // Get user for Pro plan validation
    const user = userId ? await this.usersService.findById(userId) : null;
    if (user) {
      this.validateProFeatures(dto, user);
      this.validateScheduledPrivacy(dto);
    }

    const updateData: Partial<Track> = {};

    // Basic fields
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;

    // Core metadata
    if (dto.artworkUrl !== undefined) updateData.artworkUrl = dto.artworkUrl;
    if (dto.trackLink !== undefined) updateData.trackLink = dto.trackLink;
    if (dto.mainArtists !== undefined) updateData.mainArtists = dto.mainArtists;
    if (dto.genre !== undefined) updateData.genre = dto.genre;
    if (dto.tags !== undefined) updateData.tags = dto.tags;
    if (dto.privacy !== undefined) updateData.privacy = dto.privacy;
    if (dto.scheduledAt !== undefined)
      updateData.scheduledAt = dto.scheduledAt
        ? new Date(dto.scheduledAt)
        : null;

    // Advanced details
    if (dto.buyLink !== undefined) updateData.buyLink = dto.buyLink;
    if (dto.recordLabel !== undefined) updateData.recordLabel = dto.recordLabel;
    if (dto.releaseDate !== undefined)
      updateData.releaseDate = dto.releaseDate
        ? new Date(dto.releaseDate)
        : null;
    if (dto.publisher !== undefined) updateData.publisher = dto.publisher;
    if (dto.isrc !== undefined) updateData.isrc = dto.isrc;
    if (dto.containsExplicitContent !== undefined)
      updateData.containsExplicitContent = dto.containsExplicitContent;
    if (dto.pLine !== undefined) updateData.pLine = dto.pLine;

    // Permissions
    if (dto.enableDirectDownloads !== undefined)
      updateData.enableDirectDownloads = dto.enableDirectDownloads;
    if (dto.enableOfflineListening !== undefined)
      updateData.enableOfflineListening = dto.enableOfflineListening;
    if (dto.includeInRssFeed !== undefined)
      updateData.includeInRssFeed = dto.includeInRssFeed;
    if (dto.displayEmbedCode !== undefined)
      updateData.displayEmbedCode = dto.displayEmbedCode;
    if (dto.enableAppPlayback !== undefined)
      updateData.enableAppPlayback = dto.enableAppPlayback;

    // Engagement privacy
    if (dto.allowComments !== undefined)
      updateData.allowComments = dto.allowComments;
    if (dto.showCommentsToPublic !== undefined)
      updateData.showCommentsToPublic = dto.showCommentsToPublic;
    if (dto.showInsightsToPublic !== undefined)
      updateData.showInsightsToPublic = dto.showInsightsToPublic;
    if (dto.geoblockingType !== undefined)
      updateData.geoblockingType = dto.geoblockingType;
    if (dto.allowedRegions !== undefined)
      updateData.allowedRegions = dto.allowedRegions;
    if (dto.blockedRegions !== undefined)
      updateData.blockedRegions = dto.blockedRegions;

    // Audio preview
    if (dto.previewStartTime !== undefined)
      updateData.previewStartTime = dto.previewStartTime;

    // Licensing
    if (dto.licenseType !== undefined) updateData.licenseType = dto.licenseType;

    return this.trackRepository.update(id, updateData);
  }

  /**
   * Publish scheduled tracks that are due to be published
   * This method should be called by a cron job or scheduler
   */
  async publishScheduledTracks(): Promise<Track[]> {
    const now = new Date();
    const scheduledTracks =
      await this.trackRepository.findScheduledTracksReady(now);

    const publishedTracks: Track[] = [];

    for (const track of scheduledTracks) {
      try {
        const updatedTrack = await this.trackRepository.update(track.id, {
          privacy: TrackPrivacy.Public,
          scheduledAt: null, // Clear the scheduled date
        });
        publishedTracks.push(updatedTrack);
        this.logger.log(
          `Published scheduled track: ${track.id} - "${track.title}"`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to publish scheduled track ${track.id}:`,
          error,
        );
      }
    }

    return publishedTracks;
  }

  /**
   * Get tracks that are scheduled for publishing
   */
  async getScheduledTracks(userId?: string): Promise<Track[]> {
    return this.trackRepository.findScheduledTracks(userId);
  }

  private resolveObjectKey(track: Track): string {
    if (track.transcodedObjectKey && track.status === TrackStatus.Ready) {
      return track.transcodedObjectKey;
    }
    return track.objectKey;
  }

  async findAll(
    limit: number = 10,
    offset: number = 0,
  ): Promise<[Track[], number]> {
    return this.trackRepository.findAll(limit, offset);
  }

  async buildStream(id: string, rangeHeader?: string): Promise<StreamPayload> {
    const track = await this.findOneOrFail(id);
    const objectKey = this.resolveObjectKey(track);
    const stat = await this.storageService.statObject(objectKey);
    // get info size, metadata
    const size = Number(stat.size);

    if (rangeHeader) {
      const result = this.parseRange(rangeHeader, size);
      const stream = await this.storageService.getObjectRange(
        objectKey,
        result.start,
        result.end,
      );
      return {
        stream,
        start: result.start,
        end: result.end,
        size,
        contentType:
          (stat.metaData as Record<string, string> | undefined)?.[
            'content-type'
          ] ?? track.contentType,
      };
    }

    // gọi storage service để lấy full stream
    const stream = await this.storageService.getObjectStream(objectKey);
    return {
      stream,
      start: 0,
      end: size - 1,
      size,
      contentType:
        (stat.metaData as Record<string, string> | undefined)?.[
          'content-type'
        ] ?? track.contentType,
    };
  }

  private parseRange(
    range: string,
    size: number,
  ): { start: number; end: number } {
    const matches = /bytes=(\d*)-(\d*)/.exec(range);
    if (!matches) {
      throw new BadRequestException('Invalid Range header');
    }
    const start = matches[1] ? parseInt(matches[1], 10) : 0;
    const requestedEnd = matches[2] ? parseInt(matches[2], 10) : size - 1;
    const end = Math.min(requestedEnd, size - 1);

    if (start >= size || start < 0 || end < start) {
      throw new BadRequestException('Range Not Satisfiable');
    }

    return { start, end };
  }

  private resolvePlanLimitSeconds(user: User): number {
    const now = new Date();
    const proActive =
      user.subscriptionPlan === SubscriptionPlan.Pro &&
      (!user.subscriptionExpiresAt || user.subscriptionExpiresAt > now);

    if (!proActive) {
      return this.freeLimitSeconds;
    }

    if (this.proLimitSeconds > 0) {
      return this.proLimitSeconds;
    }

    return Infinity;
  }

  private validateProFeatures(
    dto: CreateTrackDto | UpdateTrackDto,
    user: User,
  ): void {
    const hasProPlan = this.hasActiveProPlan(user);

    // Show insights to public requires Pro plan
    if (dto.showInsightsToPublic === true && !hasProPlan) {
      throw new BadRequestException(
        'Showing track insights to public requires Artist Pro plan',
      );
    }

    // Scheduled privacy requires Pro plan
    if (dto.privacy === TrackPrivacy.Scheduled && !hasProPlan) {
      throw new BadRequestException(
        'Scheduled track publishing requires Artist Pro plan',
      );
    }

    // Geoblocking (non-worldwide) requires Pro plan
    if (
      dto.geoblockingType &&
      (dto.geoblockingType as string) !== 'worldwide' &&
      !hasProPlan
    ) {
      throw new BadRequestException(
        'Advanced geoblocking options require Artist Pro plan',
      );
    }
  }

  private validateScheduledPrivacy(dto: CreateTrackDto | UpdateTrackDto): void {
    if (dto.privacy === TrackPrivacy.Scheduled) {
      if (!dto.scheduledAt) {
        throw new BadRequestException(
          'Scheduled publish date is required when privacy is set to scheduled',
        );
      }

      const scheduledDate = new Date(dto.scheduledAt);
      const now = new Date();

      if (scheduledDate <= now) {
        throw new BadRequestException(
          'Scheduled publish date must be in the future',
        );
      }

      // Limit to reasonable future date (e.g., 1 year)
      const maxFutureDate = new Date();
      maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);

      if (scheduledDate > maxFutureDate) {
        throw new BadRequestException(
          'Scheduled publish date cannot be more than 1 year in the future',
        );
      }
    }
  }

  private hasActiveProPlan(user: User): boolean {
    const now = new Date();
    return (
      user.subscriptionPlan === SubscriptionPlan.Pro &&
      (!user.subscriptionExpiresAt || user.subscriptionExpiresAt > now)
    );
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);
    return `${value.toFixed(2)} ${sizes[i]}`;
  }
}
