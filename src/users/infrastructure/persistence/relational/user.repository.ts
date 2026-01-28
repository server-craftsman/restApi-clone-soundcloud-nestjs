import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../../domain/user';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './mappers/user.mapper';
import { UserRepositoryAbstract } from './repositories/user.repository.abstract';
import { BaseRepositoryImpl } from '../../../../core/base/base.repository.impl';

@Injectable()
export class UserRepository extends UserRepositoryAbstract {
  private readonly typOrmRepository: Repository<UserEntity>;
  private readonly baseRepository: BaseRepositoryImpl<UserEntity>;

  constructor(
    dataSource: DataSource,
    private mapper: UserMapper,
  ) {
    super();
    this.typOrmRepository = dataSource.getRepository(UserEntity);
    this.baseRepository = new BaseRepositoryImpl<UserEntity>(
      dataSource,
      UserEntity,
    );
  }

  // Override base methods to apply mapper transformation
  async create(user: Partial<User>): Promise<User> {
    const entity = this.mapper.toEntity(user);
    const saved = await this.typOrmRepository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.baseRepository.findById(id);
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(limit = 10, offset = 0): Promise<[User[], number]> {
    const [entities, count] = await this.typOrmRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return [this.mapper.toDomainArray(entities), count];
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.typOrmRepository.update(id, user);
    const updated = await this.typOrmRepository.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('User not found');
    return this.mapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.typOrmRepository.delete(id);
  }

  // Custom methods
  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.typOrmRepository.findOne({ where: { email } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByProvider(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    const entity = await this.typOrmRepository.findOne({
      where: { provider, providerId },
    });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    const entity = await this.typOrmRepository.findOne({
      where: { emailVerificationToken: token },
    });
    return entity ? this.mapper.toDomain(entity) : null;
  }
}
