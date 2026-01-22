import { Injectable } from '@nestjs/common';
import { User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserMapper {
  toDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      provider: entity.provider,
      providerId: entity.providerId,
      password: entity.password,
      avatar: entity.avatar,
      bio: entity.bio,
      subscriptionPlan: entity.subscriptionPlan,
      subscriptionExpiresAt: entity.subscriptionExpiresAt,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toEntity(domain: User | Partial<User>): UserEntity {
    const entity = new UserEntity();
    Object.assign(entity, domain);
    return entity;
  }

  toDomainArray(entities: UserEntity[]): User[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
