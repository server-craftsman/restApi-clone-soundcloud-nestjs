import {
  Controller,
  Get,
  Post,
  Put,
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
import { PlaylistsService } from './playlists.service';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { User } from '../users/domain/user';
import {
  PlaylistDto,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddTrackDto,
} from './dto';
import { BaseController } from '../core/base/base.controller';

@ApiTags('Playlists')
@Controller('playlists')
export class PlaylistsController extends BaseController {
  constructor(private readonly playlistsService: PlaylistsService) {
    super();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create playlist' })
  @ApiResponse({ status: 201, type: PlaylistDto })
  async createPlaylist(
    @Body() dto: CreatePlaylistDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const playlist = await this.playlistsService.createPlaylist(user.id, dto);
    return this.sendSuccess(
      res,
      {
        id: playlist.id,
        userId: playlist.userId,
        title: playlist.title,
        description: playlist.description,
        isPublic: playlist.isPublic,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
      },
      'Playlist created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get playlist' })
  @ApiResponse({ status: 200, type: PlaylistDto })
  async getPlaylist(@Param('id') id: string, @Res() res: Response) {
    const playlist = await this.playlistsService.getPlaylist(id);
    return this.sendSuccess(res, {
      id: playlist.id,
      userId: playlist.userId,
      title: playlist.title,
      description: playlist.description,
      isPublic: playlist.isPublic,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user playlists' })
  @ApiResponse({ status: 200 })
  async getUserPlaylists(
    @CurrentUser() user: User,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Res() res: Response,
  ) {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [playlists, total] = await this.playlistsService.getUserPlaylists(
      user.id,
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    return this.sendPaginated(res, playlists, total, page, pageSize);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update playlist' })
  @ApiResponse({ status: 200, type: PlaylistDto })
  async updatePlaylist(
    @Param('id') id: string,
    @Body() dto: UpdatePlaylistDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const playlist = await this.playlistsService.updatePlaylist(
      id,
      user.id,
      dto,
    );
    return this.sendSuccess(
      res,
      {
        id: playlist.id,
        userId: playlist.userId,
        title: playlist.title,
        description: playlist.description,
        isPublic: playlist.isPublic,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
      },
      'Playlist updated successfully',
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete playlist' })
  @ApiResponse({ status: 200 })
  async deletePlaylist(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    await this.playlistsService.deletePlaylist(id, user.id);
    return this.sendSuccess(res, null, 'Playlist deleted successfully');
  }

  @Post(':id/tracks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add track to playlist' })
  @ApiResponse({ status: 201 })
  async addTrack(
    @Param('id') playlistId: string,
    @Body() dto: AddTrackDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    await this.playlistsService.addTrackToPlaylist(
      playlistId,
      dto.trackId,
      user.id,
    );
    return this.sendSuccess(
      res,
      null,
      'Track added to playlist successfully',
      HttpStatus.CREATED,
    );
  }

  @Delete(':id/tracks/:trackId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove track from playlist' })
  @ApiResponse({ status: 200 })
  async removeTrack(
    @Param('id') playlistId: string,
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    await this.playlistsService.removeTrackFromPlaylist(
      playlistId,
      trackId,
      user.id,
    );
    return this.sendSuccess(res, null, 'Track removed from playlist');
  }

  @Get(':id/tracks')
  @ApiOperation({ summary: 'Get playlist tracks' })
  @ApiResponse({ status: 200 })
  async getPlaylistTracks(
    @Param('id') playlistId: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Res() res: Response,
  ) {
    const pageSize = parseInt(limit);
    const pageOffset = parseInt(offset);
    const [tracks, total] = await this.playlistsService.getPlaylistTracks(
      playlistId,
      pageSize,
      pageOffset,
    );
    const page = Math.floor(pageOffset / pageSize) + 1;
    return this.sendPaginated(res, tracks, total, page, pageSize);
  }
}
