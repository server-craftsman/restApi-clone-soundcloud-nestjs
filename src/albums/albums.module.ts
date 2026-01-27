import { Module } from '@nestjs/common';
import { RelationalAlbumPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';

@Module({
  imports: [RelationalAlbumPersistenceModule],
  providers: [AlbumsService],
  controllers: [AlbumsController],
  exports: [AlbumsService],
})
export class AlbumsModule {}
