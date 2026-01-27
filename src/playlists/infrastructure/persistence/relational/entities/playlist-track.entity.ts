import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaylistEntity } from './playlist.entity';
import { TrackEntity } from '../../../../../tracks/infrastructure/persistence/relational/entities/track.entity';

@Entity({ name: 'playlist_tracks' })
export class PlaylistTrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'playlist_id', type: 'uuid' })
  playlistId!: string;

  @Column({ name: 'track_id', type: 'uuid' })
  trackId!: string;

  @Column({ type: 'integer' })
  position!: number;

  @CreateDateColumn({ name: 'added_at' })
  addedAt!: Date;

  @ManyToOne(() => PlaylistEntity, (p) => p.tracks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playlist_id' })
  playlist?: PlaylistEntity;

  @ManyToOne(() => TrackEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'track_id' })
  track?: TrackEntity;
}
