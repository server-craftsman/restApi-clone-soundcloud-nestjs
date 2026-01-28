import { Injectable } from '@nestjs/common';
import { DataSource, ObjectLiteral } from 'typeorm';
import { BaseRepository } from './base.repository';

/**
 * Concrete implementation of BaseRepository that can be instantiated
 */
@Injectable()
export class BaseRepositoryImpl<
  T extends ObjectLiteral,
> extends BaseRepository<T> {
  constructor(
    dataSource: DataSource,
    private entityClass: new () => T,
  ) {
    super(dataSource);
    this.repository = dataSource.getRepository(entityClass);
  }
}
