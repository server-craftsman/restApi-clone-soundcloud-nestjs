import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowingEntity } from './entities/following.entity';
import { FollowingMapper } from './mappers/following.mapper';
import { FollowingRepository } from './following.repository';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { UserMapper } from '../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([FollowingEntity, UserEntity])],
  providers: [FollowingMapper, FollowingRepository, UserMapper],
  exports: [FollowingRepository],
})
export class RelationalFollowingPersistenceModule {}
