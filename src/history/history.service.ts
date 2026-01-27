import { Injectable } from '@nestjs/common';
import { HistoryRepository } from './infrastructure/persistence/relational/history.repository';
import { History } from './domain/history';

@Injectable()
export class HistoryService {
  constructor(private readonly historyRepository: HistoryRepository) {}

  async addToHistory(userId: string, trackId: string): Promise<History> {
    return this.historyRepository.create({ userId, trackId });
  }

  async getUserHistory(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<[History[], number]> {
    return this.historyRepository.findAllByUser(userId, limit, offset);
  }

  async removeFromHistory(userId: string, trackId: string): Promise<void> {
    await this.historyRepository.deleteByUserAndTrack(userId, trackId);
  }

  async clearHistory(userId: string): Promise<void> {
    await this.historyRepository.deleteAllByUser(userId);
  }
}
