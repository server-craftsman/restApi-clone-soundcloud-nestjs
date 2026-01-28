import { Station } from '../../../../domain/station';
import { StationTrack } from '../../../../domain/station-track';

export abstract class StationRepositoryAbstract {
  // CRUD methods from BaseRepository pattern
  abstract findById(id: string): Promise<Station | null>;
  abstract findAll(limit: number, offset: number): Promise<[Station[], number]>;
  abstract create(station: Partial<Station>): Promise<Station>;
  abstract update(id: string, station: Partial<Station>): Promise<Station>;
  abstract delete(id: string): Promise<void>;

  // Custom methods specific to Station domain
  abstract findAllByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[Station[], number]>;
  abstract findPopular(
    limit: number,
    offset: number,
  ): Promise<[Station[], number]>;
  abstract addTrack(stationId: string, trackId: string): Promise<StationTrack>;
  abstract removeTrack(stationId: string, trackId: string): Promise<void>;
  abstract getStationTracks(
    stationId: string,
    limit: number,
    offset: number,
  ): Promise<[StationTrack[], number]>;
}
