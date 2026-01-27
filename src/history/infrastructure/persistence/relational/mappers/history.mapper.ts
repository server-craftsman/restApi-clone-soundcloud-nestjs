import { Injectable } from '@nestjs/common';
import { History } from '../../../../domain/history';
import { HistoryEntity } from '../entities/history.entity';

@Injectable()
export class HistoryMapper {
  toDomain(entity: HistoryEntity): History {
    return {
      id: entity.id,
      userId: entity.userId,
      trackId: entity.trackId,
      listenedAt: entity.listenedAt,
    };
  }

  toEntity(history: Partial<History>): HistoryEntity {
    const entity = new HistoryEntity();
    if (history.userId) entity.userId = history.userId;
    if (history.trackId) entity.trackId = history.trackId;
    return entity;
  }

  toDomainArray(entities: HistoryEntity[]): History[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
