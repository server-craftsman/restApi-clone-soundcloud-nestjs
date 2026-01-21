import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/user';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { UpdateUserDto } from '../../../dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.repository.create(dto);
    return this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.repository.findOne({ where: { provider, providerId } });
  }

  async findAll(limit = 10, offset = 0): Promise<[User[], number]> {
    return this.repository.findAndCount({ take: limit, skip: offset });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.repository.update(id, dto);
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createSocialUser(payload: Partial<User>): Promise<User> {
    const user = this.repository.create(payload);
    return this.repository.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
