import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StationsService } from './stations.service';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { User } from '../users/domain/user';
import { StationDto, CreateStationDto, AddTrackDto } from './dto';

@ApiTags('Stations')
@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create station' })
  @ApiResponse({ status: 201, type: StationDto })
  async createStation(
    @Body() dto: CreateStationDto,
    @CurrentUser() user: User,
  ): Promise<StationDto> {
    const station = await this.stationsService.createStation(user.id, dto);
    return {
      id: station.id,
      userId: station.userId,
      title: station.title,
      description: station.description,
      likedCount: station.likedCount,
      createdAt: station.createdAt,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get station' })
  @ApiResponse({ status: 200, type: StationDto })
  async getStation(@Param('id') id: string): Promise<StationDto> {
    const station = await this.stationsService.getStation(id);
    return {
      id: station.id,
      userId: station.userId,
      title: station.title,
      description: station.description,
      likedCount: station.likedCount,
      createdAt: station.createdAt,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user stations' })
  @ApiResponse({ status: 200 })
  async getUserStations(
    @CurrentUser() user: User,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
  ) {
    const [stations, total] = await this.stationsService.getUserStations(
      user.id,
      parseInt(limit),
      parseInt(offset),
    );
    return {
      data: stations,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  }

  @Get('popular/list')
  @ApiOperation({ summary: 'Get popular stations' })
  @ApiResponse({ status: 200 })
  async getPopularStations(
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
  ) {
    const [stations, total] = await this.stationsService.getPopularStations(
      parseInt(limit),
      parseInt(offset),
    );
    return {
      data: stations,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete station' })
  @ApiResponse({ status: 204 })
  async deleteStation(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.stationsService.deleteStation(id, user.id);
  }

  @Post(':id/tracks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add track to station' })
  @ApiResponse({ status: 201 })
  async addTrack(
    @Param('id') stationId: string,
    @Body() dto: AddTrackDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.stationsService.addTrackToStation(stationId, dto.trackId, user.id);
  }

  @Delete(':id/tracks/:trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove track from station' })
  @ApiResponse({ status: 204 })
  async removeTrack(
    @Param('id') stationId: string,
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.stationsService.removeTrackFromStation(
      stationId,
      trackId,
      user.id,
    );
  }

  @Get(':id/tracks')
  @ApiOperation({ summary: 'Get station tracks' })
  @ApiResponse({ status: 200 })
  async getStationTracks(
    @Param('id') stationId: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
  ) {
    const [tracks, total] = await this.stationsService.getStationTracks(
      stationId,
      parseInt(limit),
      parseInt(offset),
    );
    return {
      data: tracks,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  }
}
