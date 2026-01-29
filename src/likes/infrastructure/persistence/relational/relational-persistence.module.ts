import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './entities/like.entity';
import { LikeMapper } from './mappers/like.mapper';
import { LikeRepository } from './like.repository';
import { TrackEntity } from '../../../../tracks/infrastructure/persistence/relational/entities/track.entity';
import { TrackMapper } from '../../../../tracks/infrastructure/persistence/relational/mappers/track.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity, TrackEntity])],
  providers: [LikeMapper, LikeRepository, TrackMapper],
  exports: [LikeRepository],
})
export class RelationalLikePersistenceModule {}
