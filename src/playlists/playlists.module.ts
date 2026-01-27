import { Module } from '@nestjs/common';
import { RelationalPlaylistPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';

@Module({
  imports: [RelationalPlaylistPersistenceModule],
  providers: [PlaylistsService],
  controllers: [PlaylistsController],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
