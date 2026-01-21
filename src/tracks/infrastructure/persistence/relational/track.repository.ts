import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Track } from '../../../domain/track';
import { TrackEntity } from './entities/track.entity';
import { TrackMapper } from './mappers/track.mapper';
import { TrackRepositoryAbstract } from './repositories/track.repository.abstract';

@Injectable()
export class TrackRepository extends TrackRepositoryAbstract {
  private readonly repository: Repository<TrackEntity>;

  constructor(private dataSource: DataSource, private mapper: TrackMapper) {
    super();
    this.repository = dataSource.getRepository(TrackEntity);
  }

  async findById(id: string): Promise<Track | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<[Track[], number]> {
    const [entities, count] = await this.repository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), count];
  }

  async findByTitle(title: string): Promise<Track[]> {
    const entities = await this.repository.find({
      where: { title },
      order: { createdAt: 'DESC' },
    });
    return this.mapper.toDomainArray(entities);
  }

  async create(track: Partial<Track>): Promise<Track> {
    const entity = this.mapper.toEntity(track);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, track: Partial<Track>): Promise<Track> {
    await this.repository.update(id, track);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('Track not found');
    return this.mapper.toDomain(updated);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.repository.update(id, { status: status as any });
  }

  async updateTranscodedKey(id: string, transcodedObjectKey: string): Promise<void> {
    await this.repository.update(id, { transcodedObjectKey });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
