import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StationEntity } from './station.entity';
import { TrackEntity } from '../../../../../tracks/infrastructure/persistence/relational/entities/track.entity';

@Entity({ name: 'station_tracks' })
export class StationTrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'station_id', type: 'uuid' })
  stationId!: string;

  @Column({ name: 'track_id', type: 'uuid' })
  trackId!: string;

  @CreateDateColumn({ name: 'added_at' })
  addedAt!: Date;

  @ManyToOne(() => StationEntity, (s) => s.tracks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'station_id' })
  station?: StationEntity;

  @ManyToOne(() => TrackEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'track_id' })
  track?: TrackEntity;
}
