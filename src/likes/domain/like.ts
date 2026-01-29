import { Track } from '../../tracks/domain/track';

export interface Like {
  id: string;
  userId: string;
  trackId: string;
  createdAt: Date;
  track?: Track; // Optional: populated when needed
}
