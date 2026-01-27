import { Module } from '@nestjs/common';
import { RelationalLikePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';

@Module({
  imports: [RelationalLikePersistenceModule],
  providers: [LikesService],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
