import { Module } from '@nestjs/common';
import { RelationalStationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { StationsService } from './stations.service';
import { StationsController } from './stations.controller';

@Module({
  imports: [RelationalStationPersistenceModule],
  providers: [StationsService],
  controllers: [StationsController],
  exports: [StationsService],
})
export class StationsModule {}
