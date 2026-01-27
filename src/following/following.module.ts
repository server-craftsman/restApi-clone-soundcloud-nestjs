import { Module } from '@nestjs/common';
import { RelationalFollowingPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';

@Module({
  imports: [RelationalFollowingPersistenceModule],
  providers: [FollowingService],
  controllers: [FollowingController],
  exports: [FollowingService],
})
export class FollowingModule {}
