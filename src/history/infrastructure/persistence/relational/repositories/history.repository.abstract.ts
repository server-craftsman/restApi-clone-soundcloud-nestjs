import { History } from '../../../../domain/history';

export abstract class HistoryRepositoryAbstract {
  abstract findById(id: string): Promise<History | null>;
  abstract findAllByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[History[], number]>;
  abstract findLastByUserAndTrack(
    userId: string,
    trackId: string,
  ): Promise<History | null>;
  abstract create(history: Partial<History>): Promise<History>;
  abstract deleteByUserAndTrack(userId: string, trackId: string): Promise<void>;
  abstract deleteAllByUser(userId: string): Promise<void>;
}
