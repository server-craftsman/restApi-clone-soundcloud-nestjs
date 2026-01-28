import { History } from '../../../../domain/history';

export abstract class HistoryRepositoryAbstract {
  // CRUD methods from BaseRepository pattern
  abstract findById(id: string): Promise<History | null>;
  abstract findAll(limit: number, offset: number): Promise<[History[], number]>;
  abstract create(history: Partial<History>): Promise<History>;

  // Custom methods specific to History domain
  abstract findAllByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[History[], number]>;
  abstract findLastByUserAndTrack(
    userId: string,
    trackId: string,
  ): Promise<History | null>;
  abstract deleteByUserAndTrack(userId: string, trackId: string): Promise<void>;
  abstract deleteAllByUser(userId: string): Promise<void>;
}
