import { Injectable } from '@nestjs/common';
import { Following } from '../../../../domain/following';
import { FollowingEntity } from '../entities/following.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

@Injectable()
export class FollowingMapper {
  constructor(private readonly userMapper: UserMapper) {}

  toDomain(entity: FollowingEntity): Following {
    const following: Following = {
      id: entity.id,
      followerId: entity.followerId,
      followingId: entity.followingId,
      createdAt: entity.createdAt,
    };

    if (entity.follower) {
      following.follower = this.userMapper.toDomain(entity.follower);
    }

    if (entity.following) {
      following.following = this.userMapper.toDomain(entity.following);
    }

    return following;
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
