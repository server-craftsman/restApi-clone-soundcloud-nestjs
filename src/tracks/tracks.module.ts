import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { StorageModule } from '../storage/storage.module';
import { MEDIA_TRANSCODE_QUEUE } from '../queue/queue.constants';
import { RelationalTrackPersistenceModule } from './infrastructure/persistence/relational';

@Module({
  imports: [
    ConfigModule,
    RelationalTrackPersistenceModule,
    StorageModule,
    BullModule.registerQueue({ name: MEDIA_TRANSCODE_QUEUE }),
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
