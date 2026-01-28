import { Injectable, Logger } from '@nestjs/common';
import { TracksService } from './tracks.service';

@Injectable()
export class ScheduledTrackService {
  private readonly logger = new Logger(ScheduledTrackService.name);

  constructor(private readonly tracksService: TracksService) {}

  /**
   * Manually publish scheduled tracks - this could be called by a cron job
   * or external scheduler like node-cron, or integrated with Bull Queue
   */
  async publishScheduledTracks() {
    try {
      this.logger.debug('Checking for scheduled tracks to publish...');
      const publishedTracks = await this.tracksService.publishScheduledTracks();

      if (publishedTracks.length > 0) {
        this.logger.log(`Published ${publishedTracks.length} scheduled tracks`);
      } else {
        this.logger.debug('No scheduled tracks ready for publishing');
      }

      return publishedTracks;
    } catch (error) {
      this.logger.error('Error publishing scheduled tracks:', error);
      throw error;
    }
  }

  /**
   * Get scheduled tracks ready to be published
   */
  async getTracksReadyForPublishing() {
    return this.tracksService.publishScheduledTracks();
  }
}
