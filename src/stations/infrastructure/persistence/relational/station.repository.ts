import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StationEntity } from './entities/station.entity';
import { StationTrackEntity } from './entities/station-track.entity';
import { StationMapper } from './mappers/station.mapper';
import { StationRepositoryAbstract } from './repositories/station.repository.abstract';
import { Station } from '../../../domain/station';
import { StationTrack } from '../../../domain/station-track';

@Injectable()
export class StationRepository extends StationRepositoryAbstract {
  private readonly stationRepository: Repository<StationEntity>;
  private readonly stationTrackRepository: Repository<StationTrackEntity>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly mapper: StationMapper,
  ) {
    super();
    this.stationRepository = this.dataSource.getRepository(StationEntity);
    this.stationTrackRepository =
      this.dataSource.getRepository(StationTrackEntity);
  }

  async findById(id: string): Promise<Station | null> {
    const entity = await this.stationRepository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAllByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[Station[], number]> {
    const [entities, total] = await this.stationRepository.findAndCount({
      where: { userId },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), total];
  }

  async findPopular(
    limit: number,
    offset: number,
  ): Promise<[Station[], number]> {
    const [entities, total] = await this.stationRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { likedCount: 'DESC', createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), total];
  }

  async create(station: Partial<Station>): Promise<Station> {
    const entity = this.mapper.toEntity(station);
    const saved = await this.stationRepository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.stationRepository.delete(id);
  }

  async addTrack(stationId: string, trackId: string): Promise<StationTrack> {
    const entity = new StationTrackEntity();
    entity.stationId = stationId;
    entity.trackId = trackId;
    const saved = await this.stationTrackRepository.save(entity);
    return {
      id: saved.id,
      stationId: saved.stationId,
      trackId: saved.trackId,
      addedAt: saved.addedAt,
    };
  }

  async removeTrack(stationId: string, trackId: string): Promise<void> {
    await this.stationTrackRepository.delete({ stationId, trackId });
  }

  async getStationTracks(
    stationId: string,
    limit: number,
    offset: number,
  ): Promise<[StationTrack[], number]> {
    const [entities, total] = await this.stationTrackRepository.findAndCount({
      where: { stationId },
      take: limit,
      skip: offset,
      order: { addedAt: 'DESC' },
    });
    return [
      entities.map((e) => ({
        id: e.id,
        stationId: e.stationId,
        trackId: e.trackId,
        addedAt: e.addedAt,
      })),
      total,
    ];
  }
}
