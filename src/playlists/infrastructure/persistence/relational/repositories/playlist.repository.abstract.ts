import { Playlist } from '../../../../domain/playlist';
import { PlaylistTrack } from '../../../../domain/playlist-track';

export abstract class PlaylistRepositoryAbstract {
  abstract findById(id: string): Promise<Playlist | null>;
  abstract findAllByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[Playlist[], number]>;
  abstract findPublicPlaylists(
    limit: number,
    offset: number,
  ): Promise<[Playlist[], number]>;
  abstract create(playlist: Partial<Playlist>): Promise<Playlist>;
  abstract update(id: string, playlist: Partial<Playlist>): Promise<Playlist>;
  abstract delete(id: string): Promise<void>;
  abstract addTrack(
    playlistId: string,
    trackId: string,
    position: number,
  ): Promise<PlaylistTrack>;
  abstract removeTrack(playlistId: string, trackId: string): Promise<void>;
  abstract getPlaylistTracks(
    playlistId: string,
    limit: number,
    offset: number,
  ): Promise<[PlaylistTrack[], number]>;
}
