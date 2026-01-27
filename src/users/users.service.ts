import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './domain/user';
import { UserRepository } from './infrastructure/persistence/relational/user.repository';
import { SubscriptionPlan } from '../enums';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.userRepository.create({
      ...dto,
      subscriptionPlan: dto.subscriptionPlan ?? SubscriptionPlan.Free,
      subscriptionExpiresAt: dto.subscriptionExpiresAt
        ? new Date(dto.subscriptionExpiresAt)
        : null,
      emailVerificationTokenExpiresAt: dto.emailVerificationTokenExpiresAt
        ? typeof dto.emailVerificationTokenExpiresAt === 'string'
          ? new Date(dto.emailVerificationTokenExpiresAt)
          : dto.emailVerificationTokenExpiresAt
        : null,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByProvider(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    return this.userRepository.findByProvider(provider, providerId);
  }

  async findAll(limit?: number, offset?: number): Promise<[User[], number]> {
    return this.userRepository.findAll(limit, offset);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    return this.userRepository.update(id, {
      ...dto,
      subscriptionExpiresAt: dto.subscriptionExpiresAt
        ? new Date(dto.subscriptionExpiresAt)
        : undefined,
      emailVerificationTokenExpiresAt: dto.emailVerificationTokenExpiresAt
        ? typeof dto.emailVerificationTokenExpiresAt === 'string'
          ? new Date(dto.emailVerificationTokenExpiresAt)
          : dto.emailVerificationTokenExpiresAt
        : undefined,
    });
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
    const existingByProvider = await this.findByProvider(
      payload.provider,
      payload.providerId,
    );
    if (existingByProvider) {
      if (!existingByProvider.isActive) {
        await this.userRepository.update(existingByProvider.id, {
          isActive: true,
          avatar: payload.avatar ?? existingByProvider.avatar ?? undefined,
          firstName: payload.firstName ?? existingByProvider.firstName,
          lastName: payload.lastName ?? existingByProvider.lastName,
        });
        return (await this.findById(existingByProvider.id)) as User;
      }

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
          isActive: true,
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
      subscriptionPlan: SubscriptionPlan.Free,
      subscriptionExpiresAt: null,
      isActive: true,
    });
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    return this.userRepository.findByEmailVerificationToken(token);
  }
}
