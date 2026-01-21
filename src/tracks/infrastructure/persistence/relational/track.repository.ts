import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Track } from '../../../domain/track.entity';

@Injectable()
export class TrackRepository extends Repository<Track> {
  constructor(private dataSource: DataSource) {
    super(Track, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<Track | null> {
    return this.findOne({ where: { id } });
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<[Track[], number]> {
    return this.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }

  async findByTitle(title: string): Promise<Track[]> {
    return this.find({
      where: { title },
      order: { createdAt: 'DESC' },
    });
  }

  async createTrack(track: Partial<Track>): Promise<Track> {
    const entity = this.create(track);
    return this.save(entity);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.update(id, { status: status as any });
  }

  async updateTranscodedKey(id: string, transcodedObjectKey: string): Promise<void> {
    await this.update(id, { transcodedObjectKey });
  }

  async deleteById(id: string): Promise<void> {
    await this.delete(id);
  }
}
