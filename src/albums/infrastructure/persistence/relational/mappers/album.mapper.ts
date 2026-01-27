import { Injectable } from '@nestjs/common';
import { Album } from '../../../../domain/album';
import { AlbumEntity } from '../entities/album.entity';

@Injectable()
export class AlbumMapper {
  toDomain(entity: AlbumEntity): Album {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toEntity(album: Partial<Album>): AlbumEntity {
    const entity = new AlbumEntity();
    if (album.userId) entity.userId = album.userId;
    if (album.title) entity.title = album.title;
    if (album.description) entity.description = album.description;
    return entity;
  }

  toDomainArray(entities: AlbumEntity[]): Album[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
