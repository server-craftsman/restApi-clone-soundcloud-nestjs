import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
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
import { BaseController } from '../core/base/base.controller';

@ApiTags('Stations')
@Controller('stations')
export class StationsController extends BaseController {
  constructor(private readonly stationsService: StationsService) {
    super();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create station' })
  @ApiResponse({ status: 201, type: StationDto })
  async createStation(
    @Body() dto: CreateStationDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const station = await this.stationsService.createStation(user.id, dto);
    return this.sendSuccess(
      res,
      {
        id: station.id,
        userId: station.userId,
        title: station.title,
        description: station.description,
        likedCount: station.likedCount,
        createdAt: station.createdAt,
      },
      'Station created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get station' })
  @ApiResponse({ status: 200, type: StationDto })
  async getStation(@Param('id') id: string, @Res() res: Response) {
    const station = await this.stationsService.getStation(id);
    return this.sendSuccess(res, {
      id: station.id,
      userId: station.userId,
      title: station.title,
      description: station.description,
      likedCount: station.likedCount,
      createdAt: station.createdAt,
    });
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
    @Res() res: Response,
  ) {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [stations, total] = await this.stationsService.getUserStations(
      user.id,
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    return this.sendPaginated(res, stations, total, page, pageSize);
  }

  @Get('popular/list')
  @ApiOperation({ summary: 'Get popular stations' })
  @ApiResponse({ status: 200 })
  async getPopularStations(
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Res() res: Response,
  ) {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [stations, total] = await this.stationsService.getPopularStations(
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    return this.sendPaginated(res, stations, total, page, pageSize);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete station' })
  @ApiResponse({ status: 200 })
  async deleteStation(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    await this.stationsService.deleteStation(id, user.id);
    return this.sendSuccess(res, null, 'Station deleted successfully');
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
    @Res() res: Response,
  ) {
    await this.stationsService.addTrackToStation(
      stationId,
      dto.trackId,
      user.id,
    );
    return this.sendSuccess(
      res,
      null,
      'Track added to station successfully',
      HttpStatus.CREATED,
    );
  }

  @Delete(':id/tracks/:trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove track from station' })
  @ApiResponse({ status: 200 })
  async removeTrack(
    @Param('id') stationId: string,
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    await this.stationsService.removeTrackFromStation(
      stationId,
      trackId,
      user.id,
    );
    return this.sendSuccess(res, null, 'Track removed from station');
  }

  @Get(':id/tracks')
  @ApiOperation({ summary: 'Get station tracks' })
  @ApiResponse({ status: 200 })
  async getStationTracks(
    @Param('id') stationId: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Res() res: Response,
  ) {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [tracks, total] = await this.stationsService.getStationTracks(
      stationId,
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    return this.sendPaginated(res, tracks, total, page, pageSize);
  }
}
