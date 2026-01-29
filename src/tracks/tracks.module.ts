import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { TracksController } from './tracks.controller';
import { TracksService, ScheduledTrackService } from './service';
import { StorageModule } from '../storage/storage.module';
import { MEDIA_TRANSCODE_QUEUE } from '../queue/queue.constants';
import { RelationalTrackPersistenceModule } from './infrastructure/persistence/relational';
import { UsersModule } from '../users/users.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    ConfigModule,
    RelationalTrackPersistenceModule,
    StorageModule,
    UsersModule,
    HistoryModule,
    BullModule.registerQueue({ name: MEDIA_TRANSCODE_QUEUE }),
  ],
  controllers: [TracksController],
  providers: [TracksService, ScheduledTrackService],
  exports: [TracksService],
})
export class TracksModule {}
