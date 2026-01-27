import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntity } from './entities/history.entity';
import { HistoryMapper } from './mappers/history.mapper';
import { HistoryRepository } from './history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryEntity])],
  providers: [HistoryMapper, HistoryRepository],
  exports: [HistoryRepository],
})
export class RelationalHistoryPersistenceModule {}
