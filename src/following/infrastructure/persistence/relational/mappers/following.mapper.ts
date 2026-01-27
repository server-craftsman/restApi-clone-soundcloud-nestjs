import { Injectable } from '@nestjs/common';
import { Following } from '../../../../domain/following';
import { FollowingEntity } from '../entities/following.entity';

@Injectable()
export class FollowingMapper {
  toDomain(entity: FollowingEntity): Following {
    return {
      id: entity.id,
      followerId: entity.followerId,
      followingId: entity.followingId,
      createdAt: entity.createdAt,
    };
  }

  toEntity(following: Partial<Following>): FollowingEntity {
    const entity = new FollowingEntity();
    if (following.followerId) entity.followerId = following.followerId;
    if (following.followingId) entity.followingId = following.followingId;
    return entity;
  }

  toDomainArray(entities: FollowingEntity[]): Following[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
