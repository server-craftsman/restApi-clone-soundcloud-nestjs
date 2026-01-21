import { Track } from '../../../../domain/track';

export interface ITrackRepository {
  findById(id: string): Promise<Track | null>;
  findAll(limit: number, offset: number): Promise<[Track[], number]>;
  findByTitle(title: string): Promise<Track[]>;
  create(track: Partial<Track>): Promise<Track>;
  update(id: string, track: Partial<Track>): Promise<Track>;
  updateStatus(id: string, status: string): Promise<void>;
  updateTranscodedKey(id: string, transcodedObjectKey: string): Promise<void>;
  delete(id: string): Promise<void>;
}
