import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { PlaylistTrackEntity } from './entities/playlist-track.entity';
import { PlaylistMapper } from './mappers/playlist.mapper';
import { PlaylistRepository } from './playlist.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistEntity, PlaylistTrackEntity])],
  providers: [PlaylistMapper, PlaylistRepository],
  exports: [PlaylistRepository],
})
export class RelationalPlaylistPersistenceModule {}
