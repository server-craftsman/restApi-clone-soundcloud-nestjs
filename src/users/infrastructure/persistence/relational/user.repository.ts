import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../../domain/user';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './mappers/user.mapper';
import { UserRepositoryAbstract } from './repositories/user.repository.abstract';

@Injectable()
export class UserRepository extends UserRepositoryAbstract {
  private readonly repository: Repository<UserEntity>;

  constructor(
    private dataSource: DataSource,
    private mapper: UserMapper,
  ) {
    super();
    this.repository = dataSource.getRepository(UserEntity);
  }

  async create(user: Partial<User>): Promise<User> {
    const entity = this.mapper.toEntity(user);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByProvider(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { provider, providerId },
    });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(limit = 10, offset = 0): Promise<[User[], number]> {
    const [entities, count] = await this.repository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), count];
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.repository.update(id, user);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('User not found');
    return this.mapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
