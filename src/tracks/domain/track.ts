import {
  TrackStatus,
  TrackPrivacy,
  LicenseType,
  GeoblockingType,
} from '../../enums';

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

  // Core metadata
  artworkUrl?: string | null;
  trackLink?: string | null;
  mainArtists?: string | null; // comma-separated or JSON array
  genre?: string | null;
  tags?: string | null; // comma-separated or JSON array
  privacy: TrackPrivacy;
  scheduledAt?: Date | null; // for scheduled privacy

  // Advanced details
  buyLink?: string | null;
  recordLabel?: string | null;
  releaseDate?: Date | null;
  publisher?: string | null;
  isrc?: string | null;
  containsExplicitContent: boolean;
  pLine?: string | null;

  // Permissions
  enableDirectDownloads: boolean;
  enableOfflineListening: boolean;
  includeInRssFeed: boolean;
  displayEmbedCode: boolean;
  enableAppPlayback: boolean;

  // Engagement privacy (Pro features)
  allowComments: boolean;
  showCommentsToPublic: boolean;
  showInsightsToPublic: boolean;
  geoblockingType: GeoblockingType;
  allowedRegions?: string[] | null; // for exclusive regions
  blockedRegions?: string[] | null; // for blocked regions

  // Audio preview
  previewStartTime?: number | null; // start time for 20s preview in seconds

  // Licensing
  licenseType: LicenseType;

  createdAt: Date;
  updatedAt: Date;
}
