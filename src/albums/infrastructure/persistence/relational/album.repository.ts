import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AlbumEntity } from './entities/album.entity';
import { AlbumTrackEntity } from './entities/album-track.entity';
import { AlbumMapper } from './mappers/album.mapper';
import { AlbumRepositoryAbstract } from './repositories/album.repository.abstract';
import { Album } from '../../../domain/album';
import { AlbumTrack } from '../../../domain/album-track';

@Injectable()
export class AlbumRepository extends AlbumRepositoryAbstract {
  private readonly albumRepository: Repository<AlbumEntity>;
  private readonly albumTrackRepository: Repository<AlbumTrackEntity>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly mapper: AlbumMapper,
  ) {
    super();
    this.albumRepository = this.dataSource.getRepository(AlbumEntity);
    this.albumTrackRepository = this.dataSource.getRepository(AlbumTrackEntity);
  }

  async findById(id: string): Promise<Album | null> {
    const entity = await this.albumRepository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAllByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[Album[], number]> {
    const [entities, total] = await this.albumRepository.findAndCount({
      where: { userId },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), total];
  }

  async create(album: Partial<Album>): Promise<Album> {
    const entity = this.mapper.toEntity(album);
    const saved = await this.albumRepository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, album: Partial<Album>): Promise<Album> {
    const entity = await this.albumRepository.findOne({ where: { id } });
    if (!entity) throw new Error('Album not found');

    Object.assign(entity, this.mapper.toEntity(album));
    const saved = await this.albumRepository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.albumRepository.delete(id);
  }

  async addTrack(
    albumId: string,
    trackId: string,
    position: number,
  ): Promise<AlbumTrack> {
    const entity = new AlbumTrackEntity();
    entity.albumId = albumId;
    entity.trackId = trackId;
    entity.position = position;
    const saved = await this.albumTrackRepository.save(entity);
    return {
      id: saved.id,
      albumId: saved.albumId,
      trackId: saved.trackId,
      position: saved.position,
      addedAt: saved.addedAt,
    };
  }

  async removeTrack(albumId: string, trackId: string): Promise<void> {
    await this.albumTrackRepository.delete({ albumId, trackId });
  }

  async getAlbumTracks(
    albumId: string,
    limit: number,
    offset: number,
  ): Promise<[AlbumTrack[], number]> {
    const [entities, total] = await this.albumTrackRepository.findAndCount({
      where: { albumId },
      take: limit,
      skip: offset,
      order: { position: 'ASC' },
    });
    return [
      entities.map((e) => ({
        id: e.id,
        albumId: e.albumId,
        trackId: e.trackId,
        position: e.position,
        addedAt: e.addedAt,
      })),
      total,
    ];
  }
}
