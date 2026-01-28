import { Track } from '../../../../domain/track';

export abstract class TrackRepositoryAbstract {
  // CRUD methods from BaseRepository pattern
  abstract findById(id: string): Promise<Track | null>;
  abstract findAll(limit: number, offset: number): Promise<[Track[], number]>;
  abstract create(track: Partial<Track>): Promise<Track>;
  abstract update(id: string, track: Partial<Track>): Promise<Track>;
  abstract delete(id: string): Promise<void>;

  // Custom methods specific to Track domain
  abstract findByTitle(title: string): Promise<Track[]>;
  abstract updateStatus(id: string, status: string): Promise<void>;
  abstract updateTranscodedKey(
    id: string,
    transcodedObjectKey: string,
  ): Promise<void>;
  abstract getTotalDurationSecondsByUser(userId: string): Promise<number>;
  abstract findScheduledTracksReady(currentDate: Date): Promise<Track[]>;
  abstract findScheduledTracks(userId?: string): Promise<Track[]>;
}
