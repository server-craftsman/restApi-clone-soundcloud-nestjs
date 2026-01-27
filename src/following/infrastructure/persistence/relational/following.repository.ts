import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FollowingEntity } from './entities/following.entity';
import { FollowingMapper } from './mappers/following.mapper';
import { FollowingRepositoryAbstract } from './repositories/following.repository.abstract';
import { Following } from '../../../domain/following';

@Injectable()
export class FollowingRepository extends FollowingRepositoryAbstract {
  private readonly repository: Repository<FollowingEntity>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly mapper: FollowingMapper,
  ) {
    super();
    this.repository = this.dataSource.getRepository(FollowingEntity);
  }

  async findById(id: string): Promise<Following | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByFollowerAndFollowing(
    followerId: string,
    followingId: string,
  ): Promise<Following | null> {
    const entity = await this.repository.findOne({
      where: { followerId, followingId },
    });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findUserFollowing(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[Following[], number]> {
    const [entities, total] = await this.repository.findAndCount({
      where: { followerId: userId },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), total];
  }

  async findUserFollowers(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[Following[], number]> {
    const [entities, total] = await this.repository.findAndCount({
      where: { followingId: userId },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), total];
  }

  async countFollowing(userId: string): Promise<number> {
    return this.repository.count({ where: { followerId: userId } });
  }

  async countFollowers(userId: string): Promise<number> {
    return this.repository.count({ where: { followingId: userId } });
  }

  async create(following: Partial<Following>): Promise<Following> {
    const entity = this.mapper.toEntity(following);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByFollowerAndFollowing(
    followerId: string,
    followingId: string,
  ): Promise<void> {
    await this.repository.delete({ followerId, followingId });
  }
}
