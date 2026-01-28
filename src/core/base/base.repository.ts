import { Injectable } from '@nestjs/common';
import {
  DataSource,
  Repository,
  ObjectLiteral,
  DeepPartial,
  FindOptionsWhere,
} from 'typeorm';

/**
 * Base repository abstract class with common repository patterns
 */
@Injectable()
export abstract class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(protected dataSource: DataSource) {}

  /**
   * Find entity by ID
   */
  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  /**
   * Find all entities
   */
  async findAll(skip: number = 0, take: number = 10): Promise<[T[], number]> {
    return this.repository.findAndCount({
      skip,
      take,
    });
  }

  /**
   * Create new entity
   */
  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity as unknown as T);
    return this.repository.save(newEntity);
  }

  /**
   * Update entity
   */
  async update(id: string, entity: DeepPartial<T>): Promise<T | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.repository.update(id, entity as any);
    return this.findById(id);
  }

  /**
   * Delete entity
   */
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
