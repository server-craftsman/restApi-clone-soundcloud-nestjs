import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Track } from '../../../domain/track';
import { TrackEntity } from './entities/track.entity';
import { TrackMapper } from './mappers/track.mapper';
import { TrackRepositoryAbstract } from './repositories/track.repository.abstract';
import { TrackStatus } from '../../../../enums';
import { BaseRepositoryImpl } from '../../../../core/base/base.repository.impl';

@Injectable()
export class TrackRepository extends TrackRepositoryAbstract {
  private readonly typOrmRepository: Repository<TrackEntity>;
  private readonly baseRepository: BaseRepositoryImpl<TrackEntity>;

  constructor(
    dataSource: DataSource,
    private mapper: TrackMapper,
  ) {
    super();
    this.typOrmRepository = dataSource.getRepository(TrackEntity);
    this.baseRepository = new BaseRepositoryImpl<TrackEntity>(
      dataSource,
      TrackEntity,
    );
  }

  // Override base methods to apply mapper transformation
  async findById(id: string): Promise<Track | null> {
    const entity = await this.baseRepository.findById(id);
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(
    limit: number = 10,
    offset: number = 0,
  ): Promise<[Track[], number]> {
    const [entities, count] = await this.typOrmRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), count];
  }

  async create(track: Partial<Track>): Promise<Track> {
    const entity = this.mapper.toEntity(track);
    const saved = await this.typOrmRepository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, track: Partial<Track>): Promise<Track> {
    await this.typOrmRepository.update(id, track);
    const updated = await this.typOrmRepository.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('Track not found');
    return this.mapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.typOrmRepository.delete(id);
  }

  // Custom methods
  async findByTitle(title: string): Promise<Track[]> {
    const entities = await this.typOrmRepository.find({
      where: { title },
      order: { createdAt: 'DESC' },
    });
    return this.mapper.toDomainArray(entities);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.typOrmRepository.update(id, { status: status as TrackStatus });
  }

  async updateTranscodedKey(
    id: string,
    transcodedObjectKey: string,
  ): Promise<void> {
    await this.typOrmRepository.update(id, { transcodedObjectKey });
  }

  async getTotalDurationSecondsByUser(userId: string): Promise<number> {
    const result = await this.typOrmRepository
      .createQueryBuilder('track')
      .select('SUM(COALESCE(track.durationSeconds, 0))', 'total')
      .where('track.userId = :userId', { userId })
      .getRawOne<{ total: string | null }>();
    return result?.total ? Number(result.total) : 0;
  }

  async findScheduledTracksReady(currentDate: Date): Promise<Track[]> {
    const entities = await this.typOrmRepository
      .createQueryBuilder('track')
      .where('track.privacy = :privacy', { privacy: 'scheduled' })
      .andWhere('track.scheduledAt <= :currentDate', { currentDate })
      .getMany();

    return this.mapper.toDomainArray(entities);
  }

  async findScheduledTracks(userId?: string): Promise<Track[]> {
    const where: Record<string, any> = {
      privacy: 'scheduled',
    };

    if (userId) {
      where.userId = userId;
    }

    const entities = await this.typOrmRepository.find({
      where,
      order: {
        scheduledAt: 'ASC',
      },
    });

    return this.mapper.toDomainArray(entities);
  }
}
