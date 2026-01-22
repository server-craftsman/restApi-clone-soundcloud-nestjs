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
import { CreateTrackDto } from './dto/create-track.dto';
import { StorageService } from '../storage/storage.service';
import {
  MEDIA_TRANSCODE_JOB,
  MEDIA_TRANSCODE_QUEUE,
} from '../queue/queue.constants';
import { Track } from './domain/track';
import { TrackRepository } from './infrastructure/persistence/relational/track.repository';
import { SubscriptionPlan, TrackStatus } from '../enums';
import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';
export interface StreamPayload {
  stream: NodeJS.ReadableStream;
  start: number;
  end: number;
  size: number;
  contentType: string;
}

@Injectable()
export class TracksService {
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
