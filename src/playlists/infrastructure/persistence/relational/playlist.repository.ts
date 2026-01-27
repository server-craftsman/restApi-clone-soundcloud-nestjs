import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { PlaylistTrackEntity } from './entities/playlist-track.entity';
import { PlaylistMapper } from './mappers/playlist.mapper';
import { PlaylistRepositoryAbstract } from './repositories/playlist.repository.abstract';
import { Playlist } from '../../../domain/playlist';
import { PlaylistTrack } from '../../../domain/playlist-track';

@Injectable()
export class PlaylistRepository extends PlaylistRepositoryAbstract {
  private readonly playlistRepository: Repository<PlaylistEntity>;
  private readonly playlistTrackRepository: Repository<PlaylistTrackEntity>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly mapper: PlaylistMapper,
  ) {
    super();
    this.playlistRepository = this.dataSource.getRepository(PlaylistEntity);
    this.playlistTrackRepository = this.dataSource.getRepository(
      PlaylistTrackEntity,
    );
  }

  async findById(id: string): Promise<Playlist | null> {
    const entity = await this.playlistRepository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAllByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[Playlist[], number]> {
    const [entities, total] = await this.playlistRepository.findAndCount({
      where: { userId },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), total];
  }

  async findPublicPlaylists(
    limit: number,
    offset: number,
  ): Promise<[Playlist[], number]> {
    const [entities, total] = await this.playlistRepository.findAndCount({
      where: { isPublic: true },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), total];
  }

  async create(playlist: Partial<Playlist>): Promise<Playlist> {
    const entity = this.mapper.toEntity(playlist);
    const saved = await this.playlistRepository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, playlist: Partial<Playlist>): Promise<Playlist> {
    const entity = await this.playlistRepository.findOne({ where: { id } });
    if (!entity) throw new Error('Playlist not found');

    Object.assign(entity, this.mapper.toEntity(playlist));
    const saved = await this.playlistRepository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.playlistRepository.delete(id);
  }

  async addTrack(
    playlistId: string,
    trackId: string,
    position: number,
  ): Promise<PlaylistTrack> {
    const entity = new PlaylistTrackEntity();
    entity.playlistId = playlistId;
    entity.trackId = trackId;
    entity.position = position;
    const saved = await this.playlistTrackRepository.save(entity);
    return {
      id: saved.id,
      playlistId: saved.playlistId,
      trackId: saved.trackId,
      position: saved.position,
      addedAt: saved.addedAt,
    };
  }

  async removeTrack(playlistId: string, trackId: string): Promise<void> {
    await this.playlistTrackRepository.delete({ playlistId, trackId });
  }

  async getPlaylistTracks(
    playlistId: string,
    limit: number,
    offset: number,
  ): Promise<[PlaylistTrack[], number]> {
    const [entities, total] = await this.playlistTrackRepository.findAndCount({
      where: { playlistId },
      take: limit,
      skip: offset,
      order: { position: 'ASC' },
    });
    return [
      entities.map((e) => ({
        id: e.id,
        playlistId: e.playlistId,
        trackId: e.trackId,
        position: e.position,
        addedAt: e.addedAt,
      })),
      total,
    ];
  }
}
