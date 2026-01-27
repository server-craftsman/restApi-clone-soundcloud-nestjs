import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationEntity } from './entities/station.entity';
import { StationTrackEntity } from './entities/station-track.entity';
import { StationMapper } from './mappers/station.mapper';
import { StationRepository } from './station.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StationEntity, StationTrackEntity])],
  providers: [StationMapper, StationRepository],
  exports: [StationRepository],
})
export class RelationalStationPersistenceModule {}
