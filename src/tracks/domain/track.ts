import { TrackStatus } from '../../enums';

export interface Track {
  id: string;
  title: string;
  description?: string | null;
  objectKey: string;
  transcodedObjectKey?: string | null;
  contentType: string;
  size: number;
  durationSeconds?: number | null;
  status: TrackStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class TrackDomain implements Track {
  id!: string;
  title!: string;
  description?: string | null;
  objectKey!: string;
  transcodedObjectKey?: string | null;
  contentType!: string;
  size!: number;
  durationSeconds?: number | null;
  status!: TrackStatus;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<Track>) {
    Object.assign(this, partial);
  }
}
