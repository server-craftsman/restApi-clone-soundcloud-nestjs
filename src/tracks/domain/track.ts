import { TrackStatus } from '../../enums';

export interface Track {
  id: string;
  title: string;
  description?: string | null;
  userId: string;
  objectKey: string;
  transcodedObjectKey?: string | null;
  contentType: string;
  size: number;
  durationSeconds?: number | null;
  status: TrackStatus;
  createdAt: Date;
  updatedAt: Date;
}
