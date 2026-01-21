import { Track } from '../../../../domain/track';

export abstract class TrackRepositoryAbstract {
  abstract findById(id: string): Promise<Track | null>;
  abstract findAll(limit: number, offset: number): Promise<[Track[], number]>;
  abstract findByTitle(title: string): Promise<Track[]>;
  abstract create(track: Partial<Track>): Promise<Track>;
  abstract update(id: string, track: Partial<Track>): Promise<Track>;
  abstract updateStatus(id: string, status: string): Promise<void>;
  abstract updateTranscodedKey(id: string, transcodedObjectKey: string): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
