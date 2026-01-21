import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { PassThrough } from 'node:stream';
import * as ffmpeg from 'fluent-ffmpeg';
import { TrackStatus } from '../tracks/domain/track';
import { TrackEntity } from '../tracks/infrastructure/persistence/relational/entities/track.entity';
import { StorageService } from '../storage/storage.service';
import { MEDIA_TRANSCODE_JOB, MEDIA_TRANSCODE_QUEUE } from '../queue/queue.constants';

interface TranscodeJob {
  trackId: string;
  sourceKey: string;
  targetKey: string;
}

@Injectable()
@Processor(MEDIA_TRANSCODE_QUEUE)
export class MediaTranscodeProcessor extends WorkerHost {
  private readonly logger = new Logger(MediaTranscodeProcessor.name);

  constructor(
    @InjectRepository(TrackEntity)
    private readonly trackRepository: Repository<TrackEntity>,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {
    super();
    const mediaConfig = this.configService.get('media') as { ffmpegPath?: string; ffprobePath?: string };
    if (mediaConfig?.ffmpegPath) {
      ffmpeg.setFfmpegPath(mediaConfig.ffmpegPath);
    }
    if (mediaConfig?.ffprobePath) {
      ffmpeg.setFfprobePath(mediaConfig.ffprobePath);
    }
  }

//   handle job convert audio -> convert file audio to mp3 using ffmpeg
  async process(job: Job<TranscodeJob>): Promise<void> {
    const { trackId, sourceKey, targetKey } = job.data;
    const track = await this.trackRepository.findOne({ where: { id: trackId } });
    if (!track) {
      this.logger.warn(`Track ${trackId} not found for transcode`);
      return;
    }

    await this.trackRepository.update(trackId, { status: TrackStatus.Processing });

    try {
        // path original file in storage
      const sourceStream = await this.storageService.getObjectStream(sourceKey);
      const passThrough = new PassThrough();
    //   output of ffmpeg is a stream
      const uploadPromise = this.storageService.uploadStream(targetKey, passThrough, 'audio/mpeg');

      // convert to mp3 using ffmpeg
      await new Promise<void>((resolve, reject) => {
        ffmpeg(sourceStream)
          .audioCodec('libmp3lame')
          .format('mp3')
          .on('error', (error) => reject(error))
          .on('end', () => resolve()) // when ffmpeg finished
          .pipe(passThrough, { end: true });
      });

      await uploadPromise; // wait until upload finished
      await this.trackRepository.update(trackId, {
        status: TrackStatus.Ready,
        transcodedObjectKey: targetKey,
      });
      this.logger.log(`Track ${trackId} transcoded to ${targetKey}`);
    } catch (error) {
      this.logger.error(`Failed to transcode track ${trackId}`, error as Error);
      await this.trackRepository.update(trackId, { status: TrackStatus.Failed });
      throw error;
    }
  }
}
