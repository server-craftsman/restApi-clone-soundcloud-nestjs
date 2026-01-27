import { Injectable } from '@nestjs/common';
import { Playlist } from '../../../../domain/playlist';
import { PlaylistEntity } from '../entities/playlist.entity';

@Injectable()
export class PlaylistMapper {
  toDomain(entity: PlaylistEntity): Playlist {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      isPublic: entity.isPublic,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toEntity(playlist: Partial<Playlist>): PlaylistEntity {
    const entity = new PlaylistEntity();
    if (playlist.userId) entity.userId = playlist.userId;
    if (playlist.title) entity.title = playlist.title;
    if (playlist.description) entity.description = playlist.description;
    if (playlist.isPublic !== undefined) entity.isPublic = playlist.isPublic;
    return entity;
  }

  toDomainArray(entities: PlaylistEntity[]): Playlist[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
