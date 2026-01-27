import { Album } from '../../../../domain/album';
import { AlbumTrack } from '../../../../domain/album-track';

export abstract class AlbumRepositoryAbstract {
  abstract findById(id: string): Promise<Album | null>;
  abstract findAllByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[Album[], number]>;
  abstract create(album: Partial<Album>): Promise<Album>;
  abstract update(id: string, album: Partial<Album>): Promise<Album>;
  abstract delete(id: string): Promise<void>;
  abstract addTrack(
    albumId: string,
    trackId: string,
    position: number,
  ): Promise<AlbumTrack>;
  abstract removeTrack(albumId: string, trackId: string): Promise<void>;
  abstract getAlbumTracks(
    albumId: string,
    limit: number,
    offset: number,
  ): Promise<[AlbumTrack[], number]>;
}
