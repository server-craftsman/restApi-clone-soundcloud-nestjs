import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowingEntity } from './entities/following.entity';
import { FollowingMapper } from './mappers/following.mapper';
import { FollowingRepository } from './following.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FollowingEntity])],
  providers: [FollowingMapper, FollowingRepository],
  exports: [FollowingRepository],
})
export class RelationalFollowingPersistenceModule {}
