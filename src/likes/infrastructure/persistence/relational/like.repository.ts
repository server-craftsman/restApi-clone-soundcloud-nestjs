import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LikeEntity } from './entities/like.entity';
import { LikeMapper } from './mappers/like.mapper';
import { LikeRepositoryAbstract } from './repositories/like.repository.abstract';
import { BaseRepositoryImpl } from '../../../../core/base/base.repository.impl';
import { Like } from '../../../domain/like';

@Injectable()
export class LikeRepository extends LikeRepositoryAbstract {
  private readonly repository: Repository<LikeEntity>;
  private readonly baseRepository: BaseRepositoryImpl<LikeEntity>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly mapper: LikeMapper,
  ) {
    super();
    this.repository = this.dataSource.getRepository(LikeEntity);
    this.baseRepository = new BaseRepositoryImpl<LikeEntity>(
      dataSource,
      LikeEntity,
    );
  }

  async findById(id: string): Promise<Like | null> {
    const entity = await this.baseRepository.findById(id);
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(limit: number, offset: number): Promise<[Like[], number]> {
    const [entities, total] = await this.baseRepository.findAll(offset, limit);
    return [this.mapper.toDomainArray(entities), total];
  }

  async findByUserAndTrack(
    userId: string,
    trackId: string,
  ): Promise<Like | null> {
    const entity = await this.repository.findOne({
      where: { userId, trackId },
    });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAllByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[Like[], number]> {
    const [entities, total] = await this.repository.findAndCount({
      where: { userId },
      relations: ['track'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), total];
  }

  async findAllByTrack(
    trackId: string,
    limit: number,
    offset: number,
  ): Promise<[Like[], number]> {
    const [entities, total] = await this.repository.findAndCount({
      where: { trackId },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), total];
  }

  async countByTrack(trackId: string): Promise<number> {
    return this.repository.count({ where: { trackId } });
  }

  async create(like: Partial<Like>): Promise<Like> {
    const entity = this.mapper.toEntity(like);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserAndTrack(userId: string, trackId: string): Promise<void> {
    await this.repository.delete({ userId, trackId });
  }
}
