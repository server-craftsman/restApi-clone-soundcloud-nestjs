import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HistoryEntity } from './entities/history.entity';
import { HistoryMapper } from './mappers/history.mapper';
import { HistoryRepositoryAbstract } from './repositories/history.repository.abstract';
import { History } from '../../../domain/history';

@Injectable()
export class HistoryRepository extends HistoryRepositoryAbstract {
  private readonly repository: Repository<HistoryEntity>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly mapper: HistoryMapper,
  ) {
    super();
    this.repository = this.dataSource.getRepository(HistoryEntity);
  }

  async findById(id: string): Promise<History | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAllByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[History[], number]> {
    const [entities, total] = await this.repository.findAndCount({
      where: { userId },
      take: limit,
      skip: offset,
      order: { listenedAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), total];
  }

  async findLastByUserAndTrack(
    userId: string,
    trackId: string,
  ): Promise<History | null> {
    const entity = await this.repository.findOne({
      where: { userId, trackId },
      order: { listenedAt: 'DESC' },
    });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async create(history: Partial<History>): Promise<History> {
    const entity = this.mapper.toEntity(history);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async deleteByUserAndTrack(userId: string, trackId: string): Promise<void> {
    await this.repository.delete({ userId, trackId });
  }

  async deleteAllByUser(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }
}
