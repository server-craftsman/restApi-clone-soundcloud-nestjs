import { Injectable } from '@nestjs/common';
import { Station } from '../../../../domain/station';
import { StationEntity } from '../entities/station.entity';

@Injectable()
export class StationMapper {
  toDomain(entity: StationEntity): Station {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      likedCount: entity.likedCount,
      createdAt: entity.createdAt,
    };
  }

  toEntity(station: Partial<Station>): StationEntity {
    const entity = new StationEntity();
    if (station.userId) entity.userId = station.userId;
    if (station.title) entity.title = station.title;
    if (station.description) entity.description = station.description;
    if (station.likedCount !== undefined) entity.likedCount = station.likedCount;
    return entity;
  }

  toDomainArray(entities: StationEntity[]): Station[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
