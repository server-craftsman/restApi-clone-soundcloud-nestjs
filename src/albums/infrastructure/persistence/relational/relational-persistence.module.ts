import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './entities/album.entity';
import { AlbumTrackEntity } from './entities/album-track.entity';
import { AlbumMapper } from './mappers/album.mapper';
import { AlbumRepository } from './album.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumEntity, AlbumTrackEntity])],
  providers: [AlbumMapper, AlbumRepository],
  exports: [AlbumRepository],
})
export class RelationalAlbumPersistenceModule {}
