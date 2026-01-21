import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from '../../../domain/track.entity';
import { TrackRepository } from './track.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  providers: [TrackRepository],
  exports: [TrackRepository],
})
export class RelationalTrackPersistenceModule {}
