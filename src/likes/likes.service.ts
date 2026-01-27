import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { LikeRepository } from './infrastructure/persistence/relational/like.repository';
import { Like } from './domain/like';

@Injectable()
export class LikesService {
  constructor(private readonly likeRepository: LikeRepository) {}

  async addLike(userId: string, trackId: string): Promise<Like> {
    const existing = await this.likeRepository.findByUserAndTrack(
      userId,
      trackId,
    );
    if (existing) {
      throw new BadRequestException('Track already liked');
    }
    return this.likeRepository.create({ userId, trackId });
  }

  async removeLike(userId: string, trackId: string): Promise<void> {
    const like = await this.likeRepository.findByUserAndTrack(userId, trackId);
    if (!like) {
      throw new NotFoundException('Like not found');
    }
    await this.likeRepository.deleteByUserAndTrack(userId, trackId);
  }

  async getUserLikes(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<[Like[], number]> {
    return this.likeRepository.findAllByUser(userId, limit, offset);
  }

  async isLiked(userId: string, trackId: string): Promise<boolean> {
    const like = await this.likeRepository.findByUserAndTrack(userId, trackId);
    return !!like;
  }

  async getTrackLikeCount(trackId: string): Promise<number> {
    return this.likeRepository.countByTrack(trackId);
  }
}
