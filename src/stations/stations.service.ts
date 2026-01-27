import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { StationRepository } from './infrastructure/persistence/relational/station.repository';
import { Station } from './domain/station';
import { CreateStationDto } from './dto';

@Injectable()
export class StationsService {
  constructor(private readonly stationRepository: StationRepository) {}

  async createStation(userId: string, dto: CreateStationDto): Promise<Station> {
    return this.stationRepository.create({
      userId,
      title: dto.title,
      description: dto.description,
      likedCount: 0,
    });
  }

  async getStation(id: string): Promise<Station> {
    const station = await this.stationRepository.findById(id);
    if (!station) throw new NotFoundException('Station not found');
    return station;
  }

  async getUserStations(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<[Station[], number]> {
    return this.stationRepository.findAllByUser(userId, limit, offset);
  }

  async getPopularStations(
    limit: number = 10,
    offset: number = 0,
  ): Promise<[Station[], number]> {
    return this.stationRepository.findPopular(limit, offset);
  }

  async deleteStation(id: string, userId: string): Promise<void> {
    const station = await this.getStation(id);
    if (station.userId !== userId) {
      throw new ForbiddenException('Cannot delete other users stations');
    }
    await this.stationRepository.delete(id);
  }

  async addTrackToStation(
    stationId: string,
    trackId: string,
    userId: string,
  ): Promise<void> {
    const station = await this.getStation(stationId);
    if (station.userId !== userId) {
      throw new ForbiddenException('Cannot add tracks to other users stations');
    }
    await this.stationRepository.addTrack(stationId, trackId);
  }

  async removeTrackFromStation(
    stationId: string,
    trackId: string,
    userId: string,
  ): Promise<void> {
    const station = await this.getStation(stationId);
    if (station.userId !== userId) {
      throw new ForbiddenException(
        'Cannot remove tracks from other users stations',
      );
    }
    await this.stationRepository.removeTrack(stationId, trackId);
  }

  async getStationTracks(
    stationId: string,
    limit: number = 10,
    offset: number = 0,
  ) {
    await this.getStation(stationId);
    return this.stationRepository.getStationTracks(stationId, limit, offset);
  }
}
