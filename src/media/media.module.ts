import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from '../tracks/infrastructure/persistence/relational/entities/track.entity';
import { StorageModule } from '../storage/storage.module';
import { MEDIA_TRANSCODE_QUEUE } from '../queue/queue.constants';
import { MediaTranscodeProcessor } from './media.processor';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([TrackEntity]),
    StorageModule,
    BullModule.registerQueue({ name: MEDIA_TRANSCODE_QUEUE }),
  ],
  providers: [MediaTranscodeProcessor],
})
export class MediaModule {}
