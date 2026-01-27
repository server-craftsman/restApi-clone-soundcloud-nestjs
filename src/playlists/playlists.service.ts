import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PlaylistRepository } from './infrastructure/persistence/relational/playlist.repository';
import { Playlist } from './domain/playlist';
import { CreatePlaylistDto, UpdatePlaylistDto } from './dto';

@Injectable()
export class PlaylistsService {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  async createPlaylist(
    userId: string,
    dto: CreatePlaylistDto,
  ): Promise<Playlist> {
    return this.playlistRepository.create({
      userId,
      title: dto.title,
      description: dto.description,
      isPublic: dto.isPublic || false,
    });
  }

  async getPlaylist(id: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findById(id);
    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  async getUserPlaylists(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<[Playlist[], number]> {
    return this.playlistRepository.findAllByUser(userId, limit, offset);
  }

  async updatePlaylist(
    id: string,
    userId: string,
    dto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    const playlist = await this.getPlaylist(id);
    if (playlist.userId !== userId) {
      throw new ForbiddenException('Cannot update other users playlists');
    }
    return this.playlistRepository.update(id, dto);
  }

  async deletePlaylist(id: string, userId: string): Promise<void> {
    const playlist = await this.getPlaylist(id);
    if (playlist.userId !== userId) {
      throw new ForbiddenException('Cannot delete other users playlists');
    }
    await this.playlistRepository.delete(id);
  }

  async addTrackToPlaylist(
    playlistId: string,
    trackId: string,
    userId: string,
  ): Promise<void> {
    const playlist = await this.getPlaylist(playlistId);
    if (playlist.userId !== userId) {
      throw new ForbiddenException(
        'Cannot add tracks to other users playlists',
      );
    }
    const tracks = await this.playlistRepository.getPlaylistTracks(
      playlistId,
      1,
      0,
    );
    const position = tracks[1] + 1;
    await this.playlistRepository.addTrack(playlistId, trackId, position);
  }

  async removeTrackFromPlaylist(
    playlistId: string,
    trackId: string,
    userId: string,
  ): Promise<void> {
    const playlist = await this.getPlaylist(playlistId);
    if (playlist.userId !== userId) {
      throw new ForbiddenException(
        'Cannot remove tracks from other users playlists',
      );
    }
    await this.playlistRepository.removeTrack(playlistId, trackId);
  }

  async getPlaylistTracks(
    playlistId: string,
    limit: number = 10,
    offset: number = 0,
  ) {
    await this.getPlaylist(playlistId);
    return this.playlistRepository.getPlaylistTracks(playlistId, limit, offset);
  }
}
