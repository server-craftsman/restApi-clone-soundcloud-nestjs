import { Injectable } from '@nestjs/common';
import { Track } from '../../../../domain/track';
import { TrackEntity } from '../entities/track.entity';

@Injectable()
export class TrackMapper {
  toDomain(entity: TrackEntity): Track {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      userId: entity.userId,
      objectKey: entity.objectKey,
      transcodedObjectKey: entity.transcodedObjectKey,
      contentType: entity.contentType,
      size: entity.size,
      durationSeconds: entity.durationSeconds,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toEntity(domain: Track | Partial<Track>): TrackEntity {
    const entity = new TrackEntity();
    Object.assign(entity, domain);
    return entity;
  }

  toDomainArray(entities: TrackEntity[]): Track[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
