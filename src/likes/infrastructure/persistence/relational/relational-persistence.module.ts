import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './entities/like.entity';
import { LikeMapper } from './mappers/like.mapper';
import { LikeRepository } from './like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity])],
  providers: [LikeMapper, LikeRepository],
  exports: [LikeRepository],
})
export class RelationalLikePersistenceModule {}
