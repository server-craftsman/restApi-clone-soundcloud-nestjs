import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TrackStatus } from '../../../../../enums';

@Entity({ name: 'tracks' })
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'object_key', type: 'varchar', length: 512 })
  objectKey!: string;

  @Column({
    name: 'transcoded_object_key',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  transcodedObjectKey?: string | null;

  @Column({ name: 'content_type', type: 'varchar', length: 128 })
  contentType!: string;

  @Column({
    type: 'bigint',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  size!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null | undefined) => value,
      from: (value: string | null) => (value !== null ? Number(value) : null),
    },
  })
  durationSeconds?: number | null;

  @Column({ type: 'enum', enum: TrackStatus, default: TrackStatus.Uploaded })
  status!: TrackStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
