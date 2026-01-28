import { Like } from '../../../../domain/like';

export abstract class LikeRepositoryAbstract {
  // CRUD methods from BaseRepository pattern
  abstract findById(id: string): Promise<Like | null>;
  abstract findAll(limit: number, offset: number): Promise<[Like[], number]>;
  abstract create(like: Partial<Like>): Promise<Like>;
  abstract delete(id: string): Promise<void>;

  // Custom methods specific to Like domain
  abstract findByUserAndTrack(
    userId: string,
    trackId: string,
  ): Promise<Like | null>;
  abstract findAllByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[Like[], number]>;
  abstract findAllByTrack(
    trackId: string,
    limit: number,
    offset: number,
  ): Promise<[Like[], number]>;
  abstract countByTrack(trackId: string): Promise<number>;
  abstract deleteByUserAndTrack(userId: string, trackId: string): Promise<void>;
}
