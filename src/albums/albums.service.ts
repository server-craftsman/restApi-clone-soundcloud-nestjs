import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AlbumRepository } from './infrastructure/persistence/relational/album.repository';
import { Album } from './domain/album';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { BaseService } from '../core/base/base.service';

@Injectable()
export class AlbumsService extends BaseService {
  constructor(private readonly albumRepository: AlbumRepository) {
    super();
  }

  async createAlbum(userId: string, dto: CreateAlbumDto): Promise<Album> {
    return this.albumRepository.create({
      userId,
      title: dto.title,
      description: dto.description,
    });
  }

  async getAlbum(id: string): Promise<Album> {
    const album = await this.albumRepository.findById(id);
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async getUserAlbums(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<[Album[], number]> {
    return this.albumRepository.findAllByUser(userId, limit, offset);
  }

  async updateAlbum(
    id: string,
    userId: string,
    dto: UpdateAlbumDto,
  ): Promise<Album> {
    const album = await this.getAlbum(id);
    if (album.userId !== userId) {
      throw new ForbiddenException('Cannot update other users albums');
    }
    return this.albumRepository.update(id, dto);
  }

  async deleteAlbum(id: string, userId: string): Promise<void> {
    const album = await this.getAlbum(id);
    if (album.userId !== userId) {
      throw new ForbiddenException('Cannot delete other users albums');
    }
    await this.albumRepository.delete(id);
  }

  async addTrackToAlbum(
    albumId: string,
    trackId: string,
    userId: string,
  ): Promise<void> {
    const album = await this.getAlbum(albumId);
    if (album.userId !== userId) {
      throw new ForbiddenException('Cannot add tracks to other users albums');
    }
    const tracks = await this.albumRepository.getAlbumTracks(albumId, 1, 0);
    const position = tracks[1] + 1;
    await this.albumRepository.addTrack(albumId, trackId, position);
  }

  async removeTrackFromAlbum(
    albumId: string,
    trackId: string,
    userId: string,
  ): Promise<void> {
    const album = await this.getAlbum(albumId);
    if (album.userId !== userId) {
      throw new ForbiddenException(
        'Cannot remove tracks from other users albums',
      );
    }
    await this.albumRepository.removeTrack(albumId, trackId);
  }

  async getAlbumTracks(
    albumId: string,
    limit: number = 10,
    offset: number = 0,
  ) {
    await this.getAlbum(albumId);
    return this.albumRepository.getAlbumTracks(albumId, limit, offset);
  }
}
