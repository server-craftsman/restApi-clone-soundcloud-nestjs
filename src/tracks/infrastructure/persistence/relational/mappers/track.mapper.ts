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

      // Core metadata
      artworkUrl: entity.artworkUrl,
      trackLink: entity.trackLink,
      mainArtists: entity.mainArtists,
      genre: entity.genre,
      tags: entity.tags,
      privacy: entity.privacy,
      scheduledAt: entity.scheduledAt,

      // Advanced details
      buyLink: entity.buyLink,
      recordLabel: entity.recordLabel,
      releaseDate: entity.releaseDate,
      publisher: entity.publisher,
      isrc: entity.isrc,
      containsExplicitContent: entity.containsExplicitContent,
      pLine: entity.pLine,

      // Permissions
      enableDirectDownloads: entity.enableDirectDownloads,
      enableOfflineListening: entity.enableOfflineListening,
      includeInRssFeed: entity.includeInRssFeed,
      displayEmbedCode: entity.displayEmbedCode,
      enableAppPlayback: entity.enableAppPlayback,

      // Engagement privacy
      allowComments: entity.allowComments,
      showCommentsToPublic: entity.showCommentsToPublic,
      showInsightsToPublic: entity.showInsightsToPublic,
      geoblockingType: entity.geoblockingType,
      allowedRegions: entity.allowedRegions,
      blockedRegions: entity.blockedRegions,

      // Audio preview
      previewStartTime: entity.previewStartTime,

      // Licensing
      licenseType: entity.licenseType,

      // Analytics
      viewCount: entity.viewCount,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toEntity(domain: Track | Partial<Track>): TrackEntity {
    const entity = new TrackEntity();

    if (domain.id) entity.id = domain.id;
    if (domain.title) entity.title = domain.title;
    if (domain.description !== undefined)
      entity.description = domain.description;
    if (domain.userId) entity.userId = domain.userId;
    if (domain.objectKey) entity.objectKey = domain.objectKey;
    if (domain.transcodedObjectKey !== undefined)
      entity.transcodedObjectKey = domain.transcodedObjectKey;
    if (domain.contentType) entity.contentType = domain.contentType;
    if (domain.size !== undefined) entity.size = domain.size;
    if (domain.durationSeconds !== undefined)
      entity.durationSeconds = domain.durationSeconds;
    if (domain.status) entity.status = domain.status;

    // Core metadata
    if (domain.artworkUrl !== undefined) entity.artworkUrl = domain.artworkUrl;
    if (domain.trackLink !== undefined) entity.trackLink = domain.trackLink;
    if (domain.mainArtists !== undefined)
      entity.mainArtists = domain.mainArtists;
    if (domain.genre !== undefined) entity.genre = domain.genre;
    if (domain.tags !== undefined) entity.tags = domain.tags;
    if (domain.privacy !== undefined) entity.privacy = domain.privacy;
    if (domain.scheduledAt !== undefined)
      entity.scheduledAt = domain.scheduledAt;

    // Advanced details
    if (domain.buyLink !== undefined) entity.buyLink = domain.buyLink;
    if (domain.recordLabel !== undefined)
      entity.recordLabel = domain.recordLabel;
    if (domain.releaseDate !== undefined)
      entity.releaseDate = domain.releaseDate;
    if (domain.publisher !== undefined) entity.publisher = domain.publisher;
    if (domain.isrc !== undefined) entity.isrc = domain.isrc;
    if (domain.containsExplicitContent !== undefined)
      entity.containsExplicitContent = domain.containsExplicitContent;
    if (domain.pLine !== undefined) entity.pLine = domain.pLine;

    // Permissions
    if (domain.enableDirectDownloads !== undefined)
      entity.enableDirectDownloads = domain.enableDirectDownloads;
    if (domain.enableOfflineListening !== undefined)
      entity.enableOfflineListening = domain.enableOfflineListening;
    if (domain.includeInRssFeed !== undefined)
      entity.includeInRssFeed = domain.includeInRssFeed;
    if (domain.displayEmbedCode !== undefined)
      entity.displayEmbedCode = domain.displayEmbedCode;
    if (domain.enableAppPlayback !== undefined)
      entity.enableAppPlayback = domain.enableAppPlayback;

    // Engagement privacy
    if (domain.allowComments !== undefined)
      entity.allowComments = domain.allowComments;
    if (domain.showCommentsToPublic !== undefined)
      entity.showCommentsToPublic = domain.showCommentsToPublic;
    if (domain.showInsightsToPublic !== undefined)
      entity.showInsightsToPublic = domain.showInsightsToPublic;
    if (domain.geoblockingType !== undefined)
      entity.geoblockingType = domain.geoblockingType;
    if (domain.allowedRegions !== undefined)
      entity.allowedRegions = domain.allowedRegions;
    if (domain.blockedRegions !== undefined)
      entity.blockedRegions = domain.blockedRegions;

    // Audio preview
    if (domain.previewStartTime !== undefined)
      entity.previewStartTime = domain.previewStartTime;

    // Licensing
    if (domain.licenseType !== undefined)
      entity.licenseType = domain.licenseType;

    // Analytics
    if (domain.viewCount !== undefined) entity.viewCount = domain.viewCount;

    if (domain.createdAt) entity.createdAt = domain.createdAt;
    if (domain.updatedAt) entity.updatedAt = domain.updatedAt;

    return entity;
  }

  toDomainArray(entities: TrackEntity[]): Track[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
