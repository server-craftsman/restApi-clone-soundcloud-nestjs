import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlbumEntity } from './album.entity';
import { TrackEntity } from '../../../../../tracks/infrastructure/persistence/relational/entities/track.entity';

@Entity({ name: 'album_tracks' })
export class AlbumTrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'album_id', type: 'uuid' })
  albumId!: string;

  @Column({ name: 'track_id', type: 'uuid' })
  trackId!: string;

  @Column({ type: 'integer' })
  position!: number;

  @CreateDateColumn({ name: 'added_at' })
  addedAt!: Date;

  @ManyToOne(() => AlbumEntity, (a) => a.tracks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
  album?: AlbumEntity;

  @ManyToOne(() => TrackEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'track_id' })
  track?: TrackEntity;
}
