import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './domain/user';
import { UserRepository } from './infrastructure/persistence/relational/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.userRepository.create(dto);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.userRepository.findByProvider(provider, providerId);
  }

  async findAll(limit?: number, offset?: number): Promise<[User[], number]> {
    return this.userRepository.findAll(limit, offset);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    return this.userRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }

  async upsertSocialUser(payload: {
    provider: string;
    providerId: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
  }): Promise<User> {
    const existingByProvider = await this.findByProvider(payload.provider, payload.providerId);
    if (existingByProvider) {
      return existingByProvider;
    }

    if (payload.email) {
      const existingByEmail = await this.findByEmail(payload.email);
      if (existingByEmail) {
        // link provider info if missing
        await this.userRepository.update(existingByEmail.id, {
          provider: payload.provider,
          providerId: payload.providerId,
          avatar: payload.avatar ?? existingByEmail.avatar ?? undefined,
          firstName: payload.firstName ?? existingByEmail.firstName,
          lastName: payload.lastName ?? existingByEmail.lastName,
        });
        return (await this.findById(existingByEmail.id)) as User;
      }
    }

    return this.userRepository.create({
      email: payload.email ?? `${payload.providerId}@${payload.provider}.local`,
      firstName: payload.firstName ?? payload.provider,
      lastName: payload.lastName ?? 'user',
      avatar: payload.avatar,
      provider: payload.provider,
      providerId: payload.providerId,
      password: null,
      isActive: true,
    });
  }
}
