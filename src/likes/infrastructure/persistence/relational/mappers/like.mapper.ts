import { Injectable } from '@nestjs/common';
import { Like } from '../../../../domain/like';
import { LikeEntity } from '../entities/like.entity';
import { TrackMapper } from '../../../../../tracks/infrastructure/persistence/relational/mappers/track.mapper';

@Injectable()
export class LikeMapper {
  constructor(private readonly trackMapper: TrackMapper) {}

  toDomain(entity: LikeEntity): Like {
    const like: Like = {
      id: entity.id,
      userId: entity.userId,
      trackId: entity.trackId,
      createdAt: entity.createdAt,
    };

    // Map track if it's loaded
    if (entity.track) {
      like.track = this.trackMapper.toDomain(entity.track);
    }

    return like;
  }

  toEntity(like: Partial<Like>): LikeEntity {
    const entity = new LikeEntity();
    if (like.userId) entity.userId = like.userId;
    if (like.trackId) entity.trackId = like.trackId;
    return entity;
  }

  toDomainArray(entities: LikeEntity[]): Like[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
