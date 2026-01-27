import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FollowingRepository } from './infrastructure/persistence/relational/following.repository';
import { Following } from './domain/following';

@Injectable()
export class FollowingService {
  constructor(private readonly followingRepository: FollowingRepository) {}

  async follow(followerId: string, followingId: string): Promise<Following> {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const existing = await this.followingRepository.findByFollowerAndFollowing(
      followerId,
      followingId,
    );
    if (existing) {
      throw new BadRequestException('Already following this user');
    }

    return this.followingRepository.create({ followerId, followingId });
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const following = await this.followingRepository.findByFollowerAndFollowing(
      followerId,
      followingId,
    );
    if (!following) {
      throw new NotFoundException('Following not found');
    }
    await this.followingRepository.deleteByFollowerAndFollowing(
      followerId,
      followingId,
    );
  }

  async getUserFollowing(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<[Following[], number]> {
    return this.followingRepository.findUserFollowing(userId, limit, offset);
  }

  async getUserFollowers(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<[Following[], number]> {
    return this.followingRepository.findUserFollowers(userId, limit, offset);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const following = await this.followingRepository.findByFollowerAndFollowing(
      followerId,
      followingId,
    );
    return !!following;
  }

  async getFollowingCount(userId: string): Promise<number> {
    return this.followingRepository.countFollowing(userId);
  }

  async getFollowersCount(userId: string): Promise<number> {
    return this.followingRepository.countFollowers(userId);
  }
}
