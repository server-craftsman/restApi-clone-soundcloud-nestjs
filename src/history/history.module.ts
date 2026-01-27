import { Module } from '@nestjs/common';
import { RelationalHistoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';

@Module({
  imports: [RelationalHistoryPersistenceModule],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
