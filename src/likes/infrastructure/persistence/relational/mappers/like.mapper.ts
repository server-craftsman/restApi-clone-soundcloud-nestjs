import { Injectable } from '@nestjs/common';
import { Like } from '../../../../domain/like';
import { LikeEntity } from '../entities/like.entity';

@Injectable()
export class LikeMapper {
  toDomain(entity: LikeEntity): Like {
    return {
      id: entity.id,
      userId: entity.userId,
      trackId: entity.trackId,
      createdAt: entity.createdAt,
    };
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
