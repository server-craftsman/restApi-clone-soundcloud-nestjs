import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './entities/track.entity';
import { TrackRepository } from './track.repository';
import { TrackMapper } from './mappers/track.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity])],
  providers: [TrackMapper, TrackRepository],
  exports: [TrackRepository],
})
export class RelationalTrackPersistenceModule {}
